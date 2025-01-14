import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PessoaService } from '../pessoa.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { formatarCPF } from '../suporte/formatarCPF';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  form!: FormGroup;
  
  constructor(public pessoaService: PessoaService, private router: Router) { }


  /**
  * Método para formatar o CPF enquanto o usuário digita
  */
  formatCPF(event: Event): void {
    formatarCPF(event );
  }

  /**
  * Este método é chamado quando o componente é inicializado.
  * Aqui, o formulário é configurado com todos os campos necessários para criar uma pessoa.
  */
  ngOnInit(): void {
    this.form = new FormGroup({
      status: new FormControl(true, [Validators.required]),
      cpf: new FormControl('', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]),
      nome: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(255)]),
      senha: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      confirmSenha: new FormControl('', [Validators.required, Validators.maxLength(255)])
    });

    this.form.get('senha')?.valueChanges.subscribe(() => {
      this.form.get('confirmSenha')?.updateValueAndValidity();
    });
  }

  /**
  * Método que retorna os controles do formulário.
  * Usado para acessar os controles de forma mais fácil no template
  */
  get f() {
    return this.form.controls;
  }

  /**
  * Método para submeter o formulário.
  * Quando o formulário é enviado, ele envia os dados para o serviço criar uma nova pessoa.
  */
  submit() {
    if (this.form.valid) {
      const { confirmSenha, cpf, ...pessoaData } = this.form.value;
      pessoaData.cpf = cpf.replace(/\D/g, '');  // Remove a formatação do CPF
      this.pessoaService.criar(pessoaData).subscribe(
        {
          next: (res) => {
            alert('Pessoa criada com sucesso!');
            console.log("Pessoa criada com sucesso!", res);
            
            //this.router.navigateByUrl('pessoa/create'); // Redirecionar
            // Resetando o formulário
            this.form.reset({
              status: true // Deixando de valor parão
            });
            this.form.markAsPristine();
            this.form.markAsUntouched();
          },

          error: (err) => {
            const errorMsg = `${err.status}: ${err.error}`;
            alert(errorMsg);
            console.log("Erro ao tentar criar Pessoa: ", err);
          }          
        }
      );
    }
  }
}
