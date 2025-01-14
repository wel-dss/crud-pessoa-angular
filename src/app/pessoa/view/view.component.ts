import { Component } from '@angular/core';
import { PessoaService } from '../pessoa.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Pessoa } from '../pessoa';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent {
  id!: number;
  pessoa!: Pessoa;

  constructor(
    public pessoaService: PessoaService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  /**
  * Método ngOnInit que é executado quando o componente é inicializado.
  * Aqui, estamos pegando o id da pessoa da URL e buscando as informações dela a partir do serviço.
  * @return void
  */
  ngOnInit(): void {
    this.id = this.route.snapshot.params['pessoaId'];
    this.pessoaService.pesquisarPorId(this.id).subscribe((data: Pessoa) => {
      this.pessoa = data;
    });
  }
}