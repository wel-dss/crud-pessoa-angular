import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PessoaService } from '../pessoa.service';
import { Pessoa } from '../pessoa';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})

export class IndexComponent {
  pessoas: Pessoa[] = [];

  constructor(public postService: PessoaService, private router: Router) { }

  /**
  * Este método é chamado quando o componente é inicializado.
  */
  ngOnInit(): void {
    //console.log(this.router.url);
    //console.log(window.location.href);
    this.postService.getTodas().subscribe((data: Pessoa[]) => {
      this.pessoas = data;
      console.log(this.pessoas);
    })
  }

  /**
  * Método para "deletar" uma Pessoa.
  * @param id - O id da pessoa a ser excluída.
  */
  deletePessoa(id: number) : void {
    this.postService.deletar(id).subscribe({
      next: (res) => {
        this.pessoas.forEach((p) => {
          if (p.id === id) {
            p.status = false;
          }
        })
        alert('Pessoa "deletada".');
        console.log('Pessoa "deletada".');
      },

      error: (err) => {
        alert('Erro ao tentar deletar a pessoa.');
        console.log('Erro ao tentar deletar a pessoa: ', err);
      }
    })
  }

  /**
  * Método para deletar realmente uma Pessoa.
  * @param id - O id da pessoa a ser excluída.
  */
    realmenteDeletePessoa(id: number) : void {
      this.postService.realmenteDeletar(id).subscribe({
        next: (res) => {
          this.pessoas = this.pessoas.filter(item => item.id !== id);
          alert('Pessoa totalmente deletada do sistema.');
          console.log('Pessoa totalmente deletada do sistema.');
        },
        
        error: (err) => {
          alert('Erro ao tentar deletada a Pessoa do sistema.');
          console.log('Erro ao tentar deletada a Pessoa do sistema: ', err);
        }
      })
    }
}
