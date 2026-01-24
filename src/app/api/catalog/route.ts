import { prisma } from "@/lib/prisma";

export async function GET() {
    try{
        //throw new Error("test") //Lo uso para probar el catch lanzando un error
        const platforms = await prisma.platforms.findMany();
        const categories = await prisma.expense_categories.findMany();
      
        return Response.json({ok: true, data: { platforms, categories }}); //Aqui lo que hice es devolver en el JSON un objeto de respuesta que esta compuesto por una clave ok que me muestra ok: true si es exitoso y data que contiene los datos solicitados
    }catch(e){
        return Response.json({ok: false, error: { "code": "INTERNAL_ERROR", "message": "Database error" }}, {status: 500});//Aqui lo que hice es devolver en el JSON un objeto de respuesta que esta compuesto por una clave ok que me muestra ok: false si no es exitoso y un mensaje de error 
    } //Lo meto todo en un try catch para manejar errores de base de datos u otros errores inesperados
}
