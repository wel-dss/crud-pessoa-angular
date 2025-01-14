import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PessoaService } from '../pessoa.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Pessoa } from '../pessoa';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  id!: number;
  pessoa!: Pessoa;
  form!: FormGroup;

  constructor(
    public pessoaService: PessoaService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['pessoaId'];
    this.pessoaService.pesquisarPorId(this.id).subscribe((data: Pessoa) => {
      this.pessoa = data;
      this.form.patchValue({
        nome: data.nome,
        email: data.email,
        senhaAtual: '',
        senha: '',
        confirmSenha: ''
      });
    });

    this.form = new FormGroup({
      nome: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(255)]),
      senhaAtual: new FormControl('', [Validators.required]),
      senha: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      confirmSenha: new FormControl('', [Validators.required, Validators.maxLength(255)])
    });

    this.form.get('senha')?.valueChanges.subscribe(() => {
      this.form.get('confirmSenha')?.updateValueAndValidity();
    });
  }

  get f() {
    return this.form.controls;
  }

  formatCPF(cpf: string): string {
    return cpf.replace(/(\d{3})(\d)/, '$1.$2')
              .replace(/(\d{3})(\d)/, '$1.$2')
              .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  submit() {
    if (this.form.valid) {
      let { confirmSenha, senhaAtual, senha, ...pessoaData } = this.form.value;
      pessoaData.status = this.pessoa.status;
      pessoaData.cpf = this.pessoa.cpf;

      // Validação da senha atual
      if (senhaAtual === this.pessoa.senha) {
        pessoaData.senha = senha;

        this.pessoaService.atualizar(this.id, pessoaData).subscribe({
          next: (res) => {
            this.router.navigateByUrl('pessoa/index');
            alert('Pessoa atualizada com sucesso!');
            console.log('Pessoa atualizada com sucesso! ', res);
          },
          error: (err) => {
            alert('Erro ao tentar atualizar a pessoa.');
            console.log('Erro ao tentar atualizar a pessoa: ', err);
          }
        });
      } else {
        alert('Opsss... A senha atual está incorreta.');
        console.log('Senha atual incorreta.');
      }
    }
  }
}
