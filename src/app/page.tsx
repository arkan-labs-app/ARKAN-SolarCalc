
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, User, Sun, ArrowRight } from 'lucide-react';
import React from 'react';

function PageContent() {
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());

  React.useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center mb-8">
          <Sun className="mx-auto h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold text-gray-800 mt-2">ARKAN SolarCalc</h1>
          <p className="text-muted-foreground mt-2">Escolha seu perfil de acesso</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        
        <Card className="hover:shadow-xl transition-shadow flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-4">
                <div className="bg-accent/10 p-3 rounded-full">
                    <User className="h-6 w-6 text-accent" />
                </div>
                <div>
                    <CardTitle>Calculadora para Clientes</CardTitle>
                    <CardDescription>Simule a economia e solicite um orçamento.</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col flex-grow p-6">
            <p className="text-muted-foreground mb-4 flex-grow">
              Use nossa calculadora para gerar um orçamento instantâneo, visualizar o potencial de economia e dar o primeiro passo para instalar um sistema de energia solar.
            </p>
            <Button asChild className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 shadow-lg hover:scale-105 transition-transform">
              <Link href="/calculator">
                Iniciar Simulação <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-4">
                <div className="bg-accent/10 p-3 rounded-full">
                    <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                    <CardTitle>Acesso para Vendedores</CardTitle>
                    <CardDescription>Crie propostas e gerencie leads no CRM.</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col flex-grow p-6">
             <p className="text-muted-foreground mb-4 flex-grow">
                Ferramenta interna para a equipe de vendas criar simulações detalhadas, salvar contatos e oportunidades diretamente no GoHighLevel.
            </p>
            <Button asChild className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 shadow-lg hover:scale-105 transition-transform">
              <Link href="/internal">
                Acessar Painel <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

      </div>
       <footer className="text-center mt-12 text-sm text-muted-foreground">
        <p>&copy; {currentYear} ARKAN LABS. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}

function HomePage() {
    return (
        <React.Suspense fallback={<div>Carregando...</div>}>
            <PageContent />
        </React.Suspense>
    )
}

export default HomePage;
