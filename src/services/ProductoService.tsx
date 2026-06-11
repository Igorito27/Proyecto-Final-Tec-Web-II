import type { Producto } from "../interfaces/Producto";

const URL = "https://fakestoreapi.com";

// GET ALL
export const getProductos = async (): Promise<Producto[]> => {
  try {
    const response = await fetch(`${URL}/products`);
    if (!response.ok) throw new Error("Error al obtener productos");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// GET BY ID
export const getProductoById = async (id: number): Promise<Producto> => {
  try {
    const response = await fetch(`${URL}/products/${id}`);
    if (!response.ok) throw new Error("Error al obtener producto");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// GET CATEGORIAS
export const getCategorias = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${URL}/products/categories`);
    if (!response.ok) throw new Error("Error al obtener categorías");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// GET BY CATEGORIA
export const getProductosByCategoria = async (
  categoria: string,
): Promise<Producto[]> => {
  try {
    const response = await fetch(`${URL}/products/category/${categoria}`);
    if (!response.ok)
      throw new Error("Error al obtener productos por categoría");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// CREATE
export const createProducto = async (
  producto: Omit<Producto, "id" | "rating">,
): Promise<Producto> => {
  try {
    const response = await fetch(`${URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto),
    });
    if (!response.ok) throw new Error("Error al crear producto");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// UPDATE
export const updateProducto = async (
  id: number,
  producto: Omit<Producto, "id" | "rating">,
): Promise<Producto> => {
  try {
    const response = await fetch(`${URL}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto),
    });
    if (!response.ok) throw new Error("Error al actualizar producto");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// DELETE
export const deleteProducto = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${URL}/products/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar producto");
  } catch (error) {
    console.error(error);
    throw error;
  }
};
