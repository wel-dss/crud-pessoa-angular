import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, } from 'rxjs/operators';
import { Pessoa } from './pessoa';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  private apiURL = "http://localhost:3000";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  /**
  * Método para obter todos as pessoas
  * @return response() - Retorna um Observable com todos as pessoas
  */
  getTodas(): Observable<Pessoa[]> {
    return this.httpClient.get<Pessoa[]>(this.apiURL + '/pessoas/')
      .pipe( catchError(this.errorHandler) );
  }

  /**
  * Método para criar uma novo pessoa.
  * @param pessoa - Que será criada.
  * @return response() - Retorna um Observable com a resposta da criação do pessoa.
  */
  criar(pessoa: Pessoa): Observable<Pessoa> {
    return this.httpClient.post<Pessoa>(this.apiURL + '/pessoas/create', JSON.stringify(pessoa), this.httpOptions)
      .pipe( catchError(this.errorHandler) );
  }

  /**
  * Método para encontrar uma pessoa pelo id.
  * @param id - Id que se quer pesquisar.
  * @return response() - Retorna um Observable com a pessoa encontrada
  */
  pesquisarPorId(id: number): Observable<Pessoa> {
    return this.httpClient.get<Pessoa>(this.apiURL + '/pessoas/' + id)
      .pipe( catchError(this.errorHandler) );
  }

  /**
  * Método para atualizar uma pessoa.
  * @param id - Id da pessoa a ser "deletada";
  * @param pessoa - Pessoa com informações que substituirão os dados da pessoa encontrada pelo id passado.
  * @return response() - Retorna um Observable com a resposta da atualização da pessoa.
  */
  atualizar(id: number, pessoa: Pessoa): Observable<Pessoa> {
    return this.httpClient.put<Pessoa>(this.apiURL + '/pessoas/' + id, JSON.stringify(pessoa), this.httpOptions)
      .pipe( catchError(this.errorHandler) )
  }

  /**
  * Método para "deletar" uma pessoa. Elá não terá os seus dados excuídos, mas sterá seu status mudado para false.
  * @param id - Id da pessoa a ser "deletada".
  * @return response() - Retorna um Observable com a pessoa "deletada".
  */
  deletar(id: number): Observable<Pessoa> {
    return this.pesquisarPorId(id).pipe(
      map((pessoa: Pessoa) => {
        pessoa.status = false;
        return pessoa;
      }),
      switchMap((pessoaAtualizada: Pessoa) => {
        return this.httpClient.put<Pessoa>(this.apiURL + '/pessoas/' + id, JSON.stringify(pessoaAtualizada), this.httpOptions)
          .pipe(catchError(this.errorHandler));
      })
    );
  }

  /**
  * Método para deletar realmente uma pessoa. É melhor usar o deletar(). Cuidado ao usra este método!!!! Ele é irreversível.
  * @param id - Id da pessoa a ser deletada.
  * @return response() - Retorna um Observable com a resposta da exclusão do post
  */
  realmenteDeletar(id: number) {
    return this.httpClient.delete(this.apiURL + '/pessoas/' + id, this.httpOptions)
      .pipe(catchError(this.errorHandler))
  }

  /**
  * Método para tratar erros de requisição.
  * @return response() - Retorna um Observable com a mensagem de erro.
  */
  errorHandler(error: any) {
    let errorMessage = '';
    // Se for um erro de evento (erro de rede ou outros)
    if (error.error instanceof ErrorEvent) {
      return throwError( error.error.message ); // Obtém a mensagem do erro
    }
    
    // Caso contrário, formata o erro com o código e a mensagem
    else {
      return throwError(error);
    }
  }  
}

