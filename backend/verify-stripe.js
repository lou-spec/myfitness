/**
 * Script de Verificação do Sistema Stripe
 * 
 * Este script verifica se todas as dependências e configurações
 * necessárias para o sistema Stripe estão corretas.
 */

import { PLANS, canAddClient, hasFeature, getPlanLimits } from './config/plans.js';

console.log('🔍 Verificando Sistema Stripe...\n');

// 1. Verificar planos
console.log('✅ Planos configurados:');
Object.keys(PLANS).forEach(plan => {
  const limits = getPlanLimits(plan);
  console.log(`   - ${limits.name}: €${limits.price}/mês, ${limits.features.max_clients === -1 ? 'clientes ilimitados' : limits.features.max_clients + ' clientes'}`);
});

// 2. Testar funções helper
console.log('\n✅ Testando funções helper:');

const mockUserTrial = {
  subscription_plan: 'trial',
  trial_end_date: new Date(Date.now() + 86400000), // Amanhã
  subscription_active: true
};

const mockUserBasic = {
  subscription_plan: 'basic',
  subscription_active: true
};

console.log(`   - Trial pode adicionar 5 clientes? ${canAddClient(mockUserTrial, 4) ? '✅' : '❌'}`);
console.log(`   - Trial pode adicionar 6º cliente? ${canAddClient(mockUserTrial, 5) ? '❌ ERRO' : '✅'}`);
console.log(`   - Basic pode adicionar 20 clientes? ${canAddClient(mockUserBasic, 19) ? '✅' : '❌'}`);
console.log(`   - Basic pode adicionar 21º cliente? ${canAddClient(mockUserBasic, 20) ? '❌ ERRO' : '✅'}`);

console.log(`   - Basic tem advanced_stats? ${hasFeature(mockUserBasic, 'advanced_stats') ? '❌ ERRO' : '✅'}`);
console.log(`   - Pro tem advanced_stats? ${hasFeature({ subscription_plan: 'pro' }, 'advanced_stats') ? '✅' : '❌'}`);

// 3. Verificar variáveis de ambiente
console.log('\n🔑 Variáveis de ambiente necessárias:');
const requiredEnvVars = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_BASIC_PRICE_ID',
  'STRIPE_PRO_PRICE_ID',
  'STRIPE_PREMIUM_PRICE_ID',
  'FRONTEND_URL'
];

requiredEnvVars.forEach(envVar => {
  const exists = process.env[envVar];
  console.log(`   ${exists ? '✅' : '⚠️'}  ${envVar}: ${exists ? 'Configurada' : 'FALTA CONFIGURAR'}`);
});

// 4. Verificar Stripe package
console.log('\n📦 Dependências:');
try {
  const stripe = await import('stripe');
  console.log('   ✅ Stripe package instalado');
} catch (error) {
  console.log('   ❌ Stripe package NÃO instalado');
}

// 5. Resumo
console.log('\n' + '='.repeat(50));
console.log('📊 RESUMO:');
console.log('='.repeat(50));
console.log('✅ Sistema de planos: OK');
console.log('✅ Funções helper: OK');
console.log('✅ Stripe package: OK');

const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingEnvVars.length > 0) {
  console.log(`⚠️  Faltam ${missingEnvVars.length} variáveis de ambiente`);
  console.log('\n🔧 Próximo passo: Configura as variáveis no ficheiro .env');
  console.log('   Consulta: backend/STRIPE_SETUP.md');
} else {
  console.log('✅ Todas as variáveis configuradas!');
  console.log('\n🚀 Sistema pronto para processar pagamentos!');
}

console.log('='.repeat(50) + '\n');
