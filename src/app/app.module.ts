import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; //importando recursos de formulário do Angular
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormBaseComponent } from './components/form-base/form-base.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask'; // importando máscara utilizada nos inputs de CPF, Telefone, CEP e Número em "form-base.component.html"
import { HttpClientModule } from '@angular/common/http'; //importando o HttpClient para realizar a pesquisa ViaCEP em "cep.service.service.ts"


@NgModule({
  declarations: [
    AppComponent,
    FormBaseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective, NgxMaskPipe,
    HttpClientModule
  ],
  providers: [provideNgxMask()],
  bootstrap: [AppComponent]
})
export class AppModule { }
