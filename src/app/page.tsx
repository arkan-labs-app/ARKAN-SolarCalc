
"use client";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { User, Users, ArrowRight, Sun } from 'lucide-react';
import React from 'react';

const CardSection = ({ icon, title, description, details, buttonText, onClick, buttonClassName }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md flex flex-col h-full">
    <div className="flex items-center gap-3 mb-2">
      {icon}
      <div>
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
    <p className="text-gray-600 my-4 text-sm flex-grow">{details}</p>
    <Button 
      onClick={onClick}
      className={`w-full text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:scale-105 transition-transform ${buttonClassName}`}
    >
      {buttonText} <ArrowRight className="ml-2 w-4 h-4" />
    </Button>
  </div>
);

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-gray-800 font-sans">
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8">
        
        <div className="text-center mb-12">
            <Sun className="w-12 h-12 text-primary mx-auto mb-2" />
            <h1 className="text-3xl font-bold text-gray-800">ARKAN SolarCalc</h1>
            <p className="text-gray-500 mt-1">Escolha seu perfil de acesso</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch w-full max-w-4xl">
          <CardSection
            icon={<div className="bg-orange-100 p-2 rounded-full"><User className="w-5 h-5 text-orange-500" /></div>}
            title="Calculadora para Clientes"
            description="Simule a economia e solicite um orçamento."
            details="Use nossa calculadora para gerar um orçamento instantâneo, visualizar o potencial de economia e dar o primeiro passo para instalar um sistema de energia solar."
            buttonText="Iniciar Simulação"
            onClick={() => router.push('/calc')}
            buttonClassName="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
          />
          
          <CardSection
            icon={<div className="bg-orange-100 p-2 rounded-full"><Users className="w-5 h-5 text-orange-500" /></div>}
            title="Acesso para Vendedores"
            description="Crie propostas e gerencie leads no CRM."
            details="Ferramenta interna para a equipe de vendas criar simulações detalhadas, salvar contatos e oportunidades diretamente no GoHighLevel."
            buttonText="Acessar Painel"
            onClick={() => router.push('/internal')}
            buttonClassName="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
          />
        </div>

      </main>
      
      <footer className="w-full text-center py-6">
        <p className="text-gray-500 text-xs">&copy; 2025 ARKAN LABS. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
