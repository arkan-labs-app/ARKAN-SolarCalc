
"use client";
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sun, User, Users, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50/50 p-4 font-body">
      <div className="flex flex-col items-center justify-center text-center">
        <Sun className="w-10 h-10 text-blue-600 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800">ARKAN SolarCalc</h1>
        <p className="text-gray-600 mt-2 mb-10">Escolha seu perfil de acesso</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* Card para Clientes */}
          <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 text-left flex flex-col">
            <CardContent className="flex-grow p-0">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-orange-100 rounded-full">
                  <User className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Calculadora para Clientes
                  </h2>
                  <p className="text-sm text-gray-500">
                    Simule a economia e solicite um orçamento.
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-4">
                Use nossa calculadora para gerar um orçamento instantâneo, visualizar o potencial de economia e dar o primeiro passo para instalar um sistema de energia solar.
              </p>
            </CardContent>
            <div className="mt-6">
              <Link href="/calc" passHref>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold hover:from-orange-600 hover:to-yellow-600 shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
                  Iniciar Simulação <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </Card>

          {/* Card para Vendedores */}
          <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 text-left flex flex-col">
            <CardContent className="flex-grow p-0">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Users className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Acesso para Vendedores
                  </h2>
                  <p className="text-sm text-gray-500">
                    Crie propostas e gerencie leads no CRM.
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-4">
                Ferramenta interna para a equipe de vendas criar simulações detalhadas, salvar contatos e oportunidades diretamente no GoHighLevel.
              </p>
            </CardContent>
            <div className="mt-6">
              <Link href="/internal" passHref>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold hover:from-orange-600 hover:to-yellow-600 shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
                  Acessar Painel <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      <footer className="absolute bottom-6 text-center text-xs text-gray-500">
        <p>© 2025 ARKAN LABS. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}
