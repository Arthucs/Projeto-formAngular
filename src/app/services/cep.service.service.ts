import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CepServiceService {
// Função que usa HttpClient para acessar dados do json ViaCep
  constructor(private http: HttpClient) { }
  buscarCEP(cep: string) {
    return this.http.get(`https://viacep.com.br/ws/${cep}/json/`);
  }

  validaCEP(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const cep = control.value;
  
      // Expressão regular para validar o formato do CEP
      const testar = /^\d{5}-?\d{3}$/;
      if (!testar.test(cep)) {
        return { 'cepInvalido': true };
      }

      // Verifica se o a pesquisa realizada em "buscaCEP()" resulta em um erro ou se o CEP é inexistente
      this.buscarCEP(cep).subscribe(
        (resposta: any) => {
          if (resposta.status === 400 || resposta.erro) {
            control.setErrors({'cepInvalido': true})
          } else {
            control.setErrors(null);
          }
        },
        (error) => {
          console.error('ErroNaConsulta', error);
        }
      );
  
      return null; // Retorna null se o CEP for válido
    };
  }
}
