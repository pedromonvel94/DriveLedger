import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {//Recibimos el request que basicamente es la peticion HTTP que hace el usuario
    try {
        const url = new URL(request.url); //Creo un objeto URL a partir de la URL de la solicitud entrante
        const userIdParam = url.searchParams.get("userId"); //Obtengo el userId de los parametros de la URL

        if (userIdParam === null) {
            return Response.json({ "ok": false, error: {code:"VALIDATION_ERROR", message: "userId is required"} }, { status: 400 });
        }

        const userId = parseInt(userIdParam, 10); //Convierto el userId de string a numero entero base 10 (decimal)

        if (isNaN(userId)) {//Valido que el userId sea un numero si no lo es devuelvo un error de validacion porque me devuelve NaN
            return Response.json({ "ok": false, error: {code:"VALIDATION_ERROR", message: "userId must be a number" } }, { status: 400 });
        } else{

            var vehicles = await prisma.vehicles.findMany({ where: { user_id: userId } }); //Aqui hago la consulta con prisma a la base de datos, buscando todos los vehiculos que coincidan con el user_id proporcionado en los parametros de la URL
            
            return Response.json({ ok: true, data: { userId: userId, vehicles }}, { status: 200 });
        }
    } catch (e) {
        console.log(e);
        return Response.json({ ok: false, error: { code: "INTERNAL_ERROR", message: "Database error" } }, { status: 500 });
    }
}

export async function POST(request: Request) {//Recibimos el request que basicamente es la peticion HTTP que hace el usuario (request es el objeto que trae TODO: headers, URL, body, etc)
    try{
        /*
        Codigo de ejemplo para debuggear lo que llega en el request desde Postman u otro cliente HTTP
        // 1) Miramos qué tipo de contenido está mandando Postman
        const contentType = request.headers.get("content-type");
        console.log("content-type:", contentType);

        // 2) Leemos el body como TEXTO (no como JSON)
        // Esto evita que explote si el JSON viene mal.
        const rawBody = await request.text();
        console.log("raw body:", rawBody);

        // 3) Respondemos devolviendo lo que llegó, para confirmar
        return Response.json(
        { ok: true, data: { contentType, rawBody } },
        { status: 200 }
        );
        */
        var body = await request.json(); //Obtengo el cuerpo de la peticion HTTP en formato JSON  
        
        console.log("Body received in POST /api/vehicles:", body); //Logueo el body recibido para debuggear
        console.log("user_id in body:", body.user_id); //Logueo el user_id recibido para debuggear
        console.log("Type of user_id:", typeof body.user_id); //Logueo el tipo de dato del user_id para debuggear
        
        if(body.user_id === undefined) {
            return Response.json({ "ok": false, error: {code:"VALIDATION_ERROR", message: "userId is required"} }, { status: 400 });
        }
        
        const userId = parseInt(body.user_id, 10); //Convierto el user_id de string a numero entero base 10 (decimal)

        console.log("Parsed userId:", userId); //Logueo el userId parseado para debuggear

        if(isNaN(userId)) {//Valido que el userId sea un numero si no lo es devuelvo un error de validacion porque me devuelve NaN
            return Response.json({ "ok": false, error: {code:"VALIDATION_ERROR", message: "userId must be a number" } }, { status: 400 });
        } else{
            return Response.json({ ok: true, data: body}, { status: 200 });
        }
    } catch (e) {
        console.log(e);
        return Response.json({ ok: false, error: { code: "INTERNAL_ERROR", message: "Database error" } }, { status: 500 });
    }
}