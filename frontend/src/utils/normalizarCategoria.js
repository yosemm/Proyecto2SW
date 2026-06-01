import { CATEGORIAS } from './categorias';

const normalizarTexto = (valor) => String(valor || '').trim().toLowerCase();

const mapaNormalizado = new Map();
for (const cat of CATEGORIAS) {
    mapaNormalizado.set(normalizarTexto(cat.id), cat.id);
    mapaNormalizado.set(normalizarTexto(cat.nombre), cat.id);
}

export const obtenerCategoriaId = (valorCategoria) => {
    const valor = normalizarTexto(valorCategoria);
    return mapaNormalizado.get(valor) ?? valor;
};
