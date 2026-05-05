import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('--- Configurador de Banco de Dados SIMA (V4 - Pooler Only) ---');

rl.question('Cole a SENHA do seu banco de dados Supabase: ', (password) => {
  const encodedPassword = encodeURIComponent(password);
  
  // Usaremos o Host do Pooler para ambos, pois o teste de rede confirmou que ele é o único alcançável.
  const poolerHost = 'aws-1-sa-east-1.pooler.supabase.com';
  const user = 'postgres.ugbspfscqezsqmkrgvci';

  // Link para o Prisma Client (Porta 6543)
  const dbUrl = `postgresql://${user}:${encodedPassword}@${poolerHost}:6543/postgres?pgbouncer=true`;
  
  // Link para Migrations (Porta 5432 - Usando o Pooler Host também)
  const directUrl = `postgresql://${user}:${encodedPassword}@${poolerHost}:5432/postgres`;

  const envContent = `DATABASE_URL="${dbUrl}"\nDIRECT_URL="${directUrl}"\n`;

  fs.writeFileSync('.env', envContent);
  
  console.log('\n✅ Arquivo .env atualizado com sucesso!');
  console.log('Utilizando o Host do Pooler (confirmado como acessível).');
  
  rl.close();
});
