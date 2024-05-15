import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidacaoService {

  constructor() { }

  // Função que verifica se o valor do CPF é válido utilizando a fórmula de verificação geral do CPF
  ValidaCPF(): ValidatorFn {

    return (control: AbstractControl): { [key: string]: any } | null => {
    const cpf = control.value;

    if (cpf.length !== 11 || cpf === '00000000000' || cpf === '11111111111' || cpf === '22222222222' ||
        cpf === '33333333333' || cpf === '44444444444' || cpf === '55555555555' || cpf === '66666666666' ||
        cpf === '77777777777' || cpf === '88888888888' || cpf === '99999999999') {
      return { 'cpfInvalido': true };
    }

    //Validação do primeiro dígito verificador
    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11)) {
      resto = 0;
    }

    if (resto !== parseInt(cpf.substring(9, 10))) {
      return { 'cpfInvalido': true };
    }

    // Validação do segundo dígito verificador
    soma = 0;

    for (let i = 1; i <= 10; i++) {
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11)) {
      resto = 0;
    }

    if (resto !== parseInt(cpf.substring(10, 11))) {
      return { 'cpfInvalido': true };
    }

    return null; // Retorna null se o CPF for válido
  };
  }

  // Função que verifica se o número de Telefone é válido através de uma expressão regular
  validarTel(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const tel = control.value
  
      // Validação do número de telefone usando expressão regular
      const telefoneRegex = /^1\d\d(\d\d)?$|^0800 ?\d{3} ?\d{4}$|^(\(0?([1-9a-zA-Z][0-9a-zA-Z])?[1-9]\d\) ?|0?([1-9a-zA-Z][0-9a-zA-Z])?[1-9]\d[ .-]?)?(9|9[ .-])?[2-9]\d{3}[ .-]?\d{4}$/gm;
      if (!telefoneRegex.test(tel)) {
        return { 'telInvalido': true };
      }
  
      return null; // Retorna null se o número de telefone for válido
    };
  }

  // Função que verifica se a data de nascimento é válida
  validaDataNasc(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const dataNasc = control.value;
  
      // Verifica se a data de nascimento está no formato dd/mm/aaaa
      const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      if (!regex.test(dataNasc)) {
        return { 'dataInvalida': true };
      }
  
      // Verifica se a data de nascimento é válida
      const partesData = dataNasc.split('/');
      const dia = parseInt(partesData[0], 10);
      const mes = parseInt(partesData[1], 10) - 1;
      const ano = parseInt(partesData[2], 10);
      const dataNascimentoObj = new Date(ano, mes, dia);
  
      if (dataNascimentoObj.getDate() !== dia || dataNascimentoObj.getMonth() !== mes || dataNascimentoObj.getFullYear() !== ano) {
        return { 'dataInvalida': true };
      }

      // Verifica se a data de nascimento não é no futuro
      const dataAtual = new Date();
      if (dataNascimentoObj.getTime() > dataAtual.getTime()) {
        return { 'dataInvalida': true };
      }
      // Verifica se a data de nascimento não é antiga demais
      const dataLimite = new Date();
      if (dataNascimentoObj.getTime() < dataLimite.setFullYear(1915)) {
        return { 'dataInvalida': true };
      }
      
  
      return null; // Retorna null se a data de nascimento for válida
    };
  }
}
