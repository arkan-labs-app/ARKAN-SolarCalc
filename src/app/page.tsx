
"use client";
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Users, Sun, ArrowRight } from 'lucide-react';
import React from 'react';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="text-center mb-12">
          <Sun className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800">ARKAN SolarCalc</h1>
          <p className="text-gray-500 mt-2 text-lg">Escolha seu perfil de acesso</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Card para Clientes */}
          <Card className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow flex flex-col">
            <CardContent className="p-8 flex flex-col h-full">
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 rounded-full p-3 mr-4">
                  <User className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Calculadora para Clientes</h2>
                  <p className="text-gray-500">Simule a economia e solicite um orçamento.</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6 flex-grow">
                Use nossa calculadora para gerar um orçamento instantâneo, visualizar o potencial de economia e dar o primeiro passo para instalar um sistema de energia solar.
              </p>
              <Button 
                onClick={() => router.push('/calculator')}
                className="w-full mt-auto bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-bold py-3 text-base hover:from-orange-600 hover:to-yellow-500 transition-all"
              >
                Iniciar Simulação <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>

          {/* Card para Vendedores */}
          <Card className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow flex flex-col">
            <CardContent className="p-8 flex flex-col h-full">
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 rounded-full p-3 mr-4">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Acesso para Vendedores</h2>
                  <p className="text-gray-500">Crie propostas e gerencie leads no CRM.</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6 flex-grow">
                Ferramenta interna para a equipe de vendas criar simulações detalhadas, salvar contatos e oportunidades diretamente no GoHighLevel.
              </p>
              <Button 
                onClick={() => router.push('/internal')}
                className="w-full mt-auto bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-bold py-3 text-base hover:from-orange-600 hover:to-yellow-500 transition-all"
              >
                Acessar Painel <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="w-full text-center p-4">
        <p className="text-gray-400 text-sm">&copy; 2025 ARKAN LABS. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
