// crud.js
var usuarioLogado = null;
var usuarioAdmin = { email: 'teste', senha: 'teste' };

function realizarLogin() {
    var email = document.getElementById('floatingInput').value;
    var senha = document.getElementById('floatingPassword').value;

    if (email === usuarioAdmin.email && senha === usuarioAdmin.senha) {
        alert('Login como admin bem-sucedido!');
        usuarioLogado = 'admin';
        exibirCRUD();
    } else {
        fetch('http://127.0.0.1:5500/usuarios.json')
            .then(response => response.json())
            .then(data => {
                var usuario = data.usuarios.find(user => user.email === email && user.senha === senha);
                if (usuario) {
                    alert('Login bem-sucedido!');
                    usuarioLogado = usuario;
                    exibirCRUD();
                } else {
                    alert('Credenciais inválidas. Tente novamente.');
                    usuarioLogado = null;
                    ocultarCRUD();
                }
            })
            .catch(error => {
                console.error('Erro ao obter dados de usuários:', error);
            });
    }
}

function exibirCRUD() {
    ocultarFormularioLogin();

    var crudContainer = document.createElement('div');
    crudContainer.innerHTML = `
        <h2>CRUD de Usuários</h2>
        <button onclick="cadastrarUsuario()">Cadastrar Usuário</button>
        <button onclick="modificarUsuario()">Modificar Usuário</button>
        <button onclick="deletarUsuario()">Deletar Usuário</button>
        <ul id="usuariosList"></ul>
    `;

    crudContainer.style.position = 'absolute';
    crudContainer.style.top = '50px';
    crudContainer.style.left = '50%';
    crudContainer.style.transform = 'translateX(-50%)';
    crudContainer.style.textAlign = 'center';

    // Exibir a lista de usuários
    listarUsuarios(crudContainer);

    document.body.appendChild(crudContainer);
}

function ocultarFormularioLogin() {
    document.getElementById('loginForm').style.display = 'none';
}

function listarUsuarios(container) {
    var usuariosList = document.createElement('ul');
    usuariosList.id = 'usuariosList';

    fetch('http://127.0.0.1:5500/usuarios.json')
        .then(response => response.json())
        .then(data => {
            data.usuarios.forEach(function (usuario, index) {
                var listItem = document.createElement('li');
                listItem.textContent = `Posição: ${index}, Nome: ${usuario.nome}, Email: ${usuario.email}, Senha: ${usuario.senha}`;
                usuariosList.appendChild(listItem);
            });

            container.appendChild(usuariosList);
        })
        .catch(error => {
            console.error('Erro ao obter dados de usuários:', error);
        });
}

function cadastrarUsuario() {
    var nome = prompt('Digite o nome do novo usuário:');
    var email = prompt('Digite o email do novo usuário:');
    var senha = prompt('Digite a senha do novo usuário:');

    if (nome && email && senha) {
        fetch('http://127.0.0.1:5500/usuarios.json')
            .then(response => response.json())
            .then(data => {
                var novoUsuario = { 'nome': nome, 'email': email, 'senha': senha };
                data.usuarios.push(novoUsuario);

                // Atualizar a lista de usuários
                listarUsuarios(document.body);
            })
            .catch(error => {
                console.error('Erro ao obter dados de usuários:', error);
            });
    }
}

function modificarUsuario() {
    fetch('http://127.0.0.1:5500/usuarios.json')
        .then(response => response.json())
        .then(data => {
            var dados = data.usuarios;

            if (dados.length === 0) {
                alert('Nenhum usuário cadastrado.');
                return;
            }

            var indice = prompt('Digite o índice do usuário que deseja modificar (começando do zero):');
            if (indice !== null) {
                indice = parseInt(indice);
                if (!isNaN(indice) && indice >= 0 && indice < dados.length) {
                    var novoNome = prompt('Digite o novo nome do usuário:');
                    var novoEmail = prompt('Digite o novo email do usuário:');
                    var novaSenha = prompt('Digite a nova senha do usuário:');

                    if (novoNome !== null && novoEmail !== null && novaSenha !== null) {
                        dados[indice].nome = novoNome;
                        dados[indice].email = novoEmail;
                        dados[indice].senha = novaSenha;

                        // Atualizar o arquivo JSON
                        fetch('http://127.0.0.1:5500/usuarios.json', {
                            method: 'PUT', 
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data),
                        })
                            .then(() => {
                                listarUsuarios(document.body);
                            })
                            .catch(error => {
                                console.error('Erro ao salvar dados de usuários:', error);
                            });
                    }
                } else {
                    alert('Índice inválido.');
                }
            }
        })
        .catch(error => {
            console.error('Erro ao obter dados de usuários:', error);
        });
}

function deletarUsuario() {
    fetch('http://127.0.0.1:5500/usuarios.json')
        .then(response => response.json())
        .then(data => {
            var dados = data.usuarios;

            if (dados.length === 0) {
                alert('Nenhum usuário cadastrado.');
                return;
            }

            var indice = prompt('Digite o índice do usuário que deseja deletar (começando do zero):');
            if (indice !== null) {
                indice = parseInt(indice);
                if (!isNaN(indice) && indice >= 0 && indice < dados.length) {
                   
                    dados.splice(indice, 1);

                    // Atualizar o arquivo JSON
                    fetch('http://127.0.0.1:5500/usuarios.json', {
                        method: 'PUT', 
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    })
                        .then(() => {
                            listarUsuarios(document.body);
                        })
                        .catch(error => {
                            console.error('Erro ao salvar dados de usuários:', error);
                        });
                } else {
                    alert('Índice inválido.');
                }
            }
        })
        .catch(error => {
            console.error('Erro ao obter dados de usuários:', error);
        });
}
    