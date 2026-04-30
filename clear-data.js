import Database from 'better-sqlite3';

const db = new Database('sima.db');

try {
    // Limpa apenas os dados de execuções (Alunos, Operadores e Respostas)
    // Mantém as questões (Question)
    db.prepare('DELETE FROM Answer').run();
    db.prepare('DELETE FROM Assessment').run();
    console.log('Dados de alunos, operadores e respostas limpos com sucesso!');
} catch (error) {
    console.error('Erro ao limpar o banco:', error);
} finally {
    db.close();
}
