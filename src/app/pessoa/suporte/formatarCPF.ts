/**
* Função para formatar o CPF enquanto o usuário digita
*/
export function formatarCPF(event: Event): void {
  let input = (event.target as HTMLInputElement).value.replace(/\D/g, '');
  if (input.length <= 11) {
    input = input.replace(/(\d{3})(\d)/, '$1.$2');
    input = input.replace(/(\d{3})(\d)/, '$1.$2');
    input = input.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    (event.target as HTMLInputElement).value = input;
  }
}
