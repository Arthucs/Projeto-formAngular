import { Component} from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms'; //importando recursos de formulário do Angular
import { CepServiceService } from '../../services/cep.service.service'; // importando o serviço que contém as funções que realizam a consulta ViaCEP e Validam o CEP
import { ValidacaoService } from '../../services/validacao.service'; // importando o serviço que contém as funções de validação de CPF, Telefone e Data de Nascimento

@Component({
  selector: 'app-form-base',
  templateUrl: './form-base.component.html',
  styleUrl: './form-base.component.css'
})
export class FormBaseComponent {
  formBase!: FormGroup;

  // Inicializando os imports necessários
  constructor(private formBuilder: FormBuilder,
    private cepServices: CepServiceService,
    private validacao: ValidacaoService
  ) {

    // Criando o formGroup principal e associando suas específicas validações
    // "required" é um tipo de validação do Angular considera o formulário inválido quando o campo em questão está vazio ou incompleto
    this.formBase = this.formBuilder.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], //"email" considera o formulário inválido quando o valor inserido está em formato inválido de e-mail
      dataNasc: ['', [Validators.required, validacao.validaDataNasc()]],
      tel: ['', [Validators.required, this.validacao.validarTel()]],
      
      // Agrupando os dados que correspondem ao Endereço e também associando suas específicas validações
      endereco: this.formBuilder.group({
        cep: ['', [Validators.required, cepServices.validaCEP()]],
        rua: ['', Validators.required],
        num: ['', Validators.required],
        comp: ['', Validators.required],
        bairro: ['', Validators.required],
        cidade: ['', Validators.required],
        estado: ['', Validators.required]
      }),
      cpf: ['', [Validators.required, this.validacao.ValidaCPF()] ]
    })
  }
  
//Função que verifica se campo está vazio, incompleto ou inválido depois do usuário ter clicado no campo, e logo após fora do campo.
verificaCampo(campo: string) {
  return !this.formBase.get(campo)?.valid && this.formBase.get(campo)?.touched
}
  
/*Função que verifica se o valor do campo "email" apresenta erros e retorna o erro do tipo 'email', caso existir, e depois do usuário ter clicado no campo. 
Todas as funções abaixo que seguem o padrão "verificaX()" funcionam praticamente da mesma maneira: 
Verificam se o valor apresenta erros, retornam um erro específico depois do usuário ter clicado */
verificaEmail() {
  let campoEmail = this.formBase.controls['email'];
  if (campoEmail.errors) {
    return campoEmail.errors['email'] && campoEmail.touched;

  }
}

//Verifica se o valor do campo "dataNasc" é inválido.
verificaDataNasc() {
  let campoData = this.formBase.controls['dataNasc'];
  if (campoData.errors) {
    return campoData.errors['dataInvalida'] && campoData.touched;

  }
}

//Verifica se o valor do campo "tel" é inválido.
verificaTel() {
  let campoTel = this.formBase.controls['tel'];
  if (campoTel.errors) {
    return campoTel.errors['telInvalido'] && campoTel.touched;

  }
}

//Verifica se o valor do campo "cpf" é inválido.
verificaCpf() {
  let campoCPF = this.formBase.controls['cpf'];
  if (campoCPF.errors) {
    return campoCPF.errors['cpfInvalido'] && campoCPF.touched;
  }
}

/*Função que verifica se o campo "cep" tem valor e usa a função importada "buscarCEP" para realizar a pesquisa ViaCEP. 
Com os dados obtidos, é realizado o preenchimento dos campos dentro do grupo "endereco" com as respectivas informações */
ConsultaCEP(){
  const testacep = this.formBase.get('endereco.cep');
  if (testacep) {
    const cep = testacep.value;
      this.cepServices.buscarCEP(cep).subscribe((data: any) => {
        this.formBase.patchValue({ 
          endereco: {
            rua: data.logradouro,
            num: data.numero,
            comp: data.complemento,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf
          }
        })
      })
    }
}

//Verifica se o valor do campo "cep" é inválido.
verificarCEP() {
  let campoCEP = this.formBase.get('endereco.cep');
  if (campoCEP && campoCEP.errors) {
    return (campoCEP.errors['cepInvalido'] || campoCEP.errors['ErroNaConsulta']) && campoCEP.touched;
  }
}

/*Função que verifica a invalidade do formulário inteiro, ou seja, se há algum tipo de erro no formulário. 
Caso haja, é mostrada uma mensagem de erro na tela
Caso não haja é mostrada uma mensagem confirmando o "envio" do formulário, as informações são printadas no Console e os campos são limpos */
onSubmit() {
  if (!this.formBase.valid) {
    alert("Formulário inválido \nPreencha os campos corretamente");
    return;
  }
  else {
    alert("O Formulário foi enviado!")
    console.log("Formulário válido!", this.formBase.value);
    console.log(this.formBase.controls['endereco'].value);
    this.formBase.reset();
  }
}

}
