import React, { useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { ArrowRight } from 'lucide-react';

export default function StepOne({ form, onNext, defaultValues }) {
  useEffect(() => {
    if (defaultValues) {
      Object.keys(defaultValues).forEach(key => {
        form.setValue(key, defaultValues[key]);
      });
    }
  }, [defaultValues, form]);

  const onSubmit = (data) => {
    onNext(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Seu nome completo" 
                    {...field}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input 
                    type="email"
                    placeholder="seu@email.com" 
                    {...field}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Idade */}
          <FormField
            control={form.control}
            name="idade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Idade *</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    placeholder="30" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || '')}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sexo */}
          <FormField
            control={form.control}
            name="sexo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexo *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Altura */}
          <FormField
            control={form.control}
            name="altura"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Altura (cm) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    placeholder="175" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || '')}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Peso Atual */}
          <FormField
            control={form.control}
            name="peso_atual"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Peso atual (kg) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    step="0.1"
                    placeholder="70.5" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || '')}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Peso Objetivo */}
          <FormField
            control={form.control}
            name="peso_objetivo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Peso objetivo (kg) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    step="0.1"
                    placeholder="65.0" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || '')}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Prazo */}
          <FormField
            control={form.control}
            name="prazo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prazo desejado (semanas) *</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    placeholder="12" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || '')}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Informações adicionais */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">💡 Dica</h4>
          <p className="text-sm text-blue-700">
            Seja honesto com suas informações. Dados precisos nos ajudam a criar um plano mais eficaz para você.
          </p>
        </div>

        {/* Botões de navegação */}
        <div className="flex justify-end pt-6">
          <Button 
            type="submit" 
            className="flex items-center gap-2 h-12 px-8"
            size="lg"
          >
            Próximo
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}

