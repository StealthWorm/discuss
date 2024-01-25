'use server';

import * as auth from '@/auth';
// não é estritamente necessário declarar as funções de modo separado assim, o fazemos para deixar explicito quais métodos estamos tratando e de que forma
export async function signIn() {
  return auth.signIn('github');
}

export async function signOut() {
  return auth.signOut();
}