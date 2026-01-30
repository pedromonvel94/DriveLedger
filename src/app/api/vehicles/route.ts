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
        const status400Request = (message: string) => Response.json({ "ok": false, error: {code:"VALIDATION_ERROR", message } }, { status: 400 });
        


        var body = await request.json(); //Obtengo el cuerpo de la peticion HTTP en formato JSON

        /*
        AQUI COLOCO VARIOS LOGUEOS PARA DEBUQUEAR EL CONTENIDO DEL BODY QUE LLEGA DESDE POSTMAN U OTRO CLIENTE HTTP
        console.log("Body received in POST /api/vehicles:", body); //Logueo el body recibido para debuggear
        console.log("user_id in body:", body.user_id); //Logueo el user_id recibido para debuggear
        console.log("Type of user_id:", typeof body.user_id); //Logueo el tipo de dato del user_id para debuggear
        console.log("ownership_type in body:", body.ownership_type); //Logueo el ownership_type recibido para debuggear
        */
        
        const userId = parseInt(body.user_id, 10); //Convierto el user_id de string a numero entero base 10 (decimal)
        const ownership_type = body.ownership_type; 
        var weeklyRentAmount = null;
        var alias = null; 
        var plate = null; 

        console.log("keys:", Object.keys(body))
        console.log("alias:", body.alias, "type:", typeof body.alias)
        console.log("plate:", body.plate, "type:", typeof body.plate)

        if(body.user_id === undefined || body.ownership_type === undefined) {
            return status400Request("userId and ownershipType are required");
        };

        if(isNaN(userId)) {//Valido que el userId sea un numero si no lo es devuelvo un error de validacion porque me devuelve NaN
            return status400Request("userId must be a number");
        };

        if(ownership_type !== "OWNED" && ownership_type !== "RENTED"){ //Valido que el ownership_type sea OWNED o RENTED
            return status400Request("ownershipType must be either OWNED or RENTED");
        }
        
        if(ownership_type === "RENTED") { // Si el ownership_type es RENTED, entonces el weekly_rent_amount es obligatorio y debe ser mayor a 0
            weeklyRentAmount = parseInt(body.weekly_rent_amount, 10)
            if(isNaN(weeklyRentAmount) || weeklyRentAmount <= 0){
                return status400Request("weeklyRentAmount is required and must be greater than 0 when ownershipType is RENTED");
            }
        }

        if(body.alias != null) {
            if(typeof body.alias !== "string") {//Valido que el alias sea un string
                return status400Request("alias must be a string with at least 2 characters");
            }

            alias = body.alias.trim();//Elimino espacios en blanco al inicio y al final del alias

            if(alias.length < 2) { //Valido que el alias sea un string con al menos 2 caracteres
                return status400Request("alias must be a string with at least 2 characters");
            }
        }

        console.log("alias after processing:", alias);
        
        if(body.plate != null) {
            if(typeof body.plate !== "string") {//Valido que la patente sea un string
                return status400Request("plate must be a string with at least 6 characters");
            }

            plate = body.plate.replaceAll(' ', '').toUpperCase(); //Elimino espacios en blanco y convierto a mayusculas la patente
            
            if(plate.length < 6) { //Valido que la patente sea un string con al menos 6 caracteres
                return status400Request("plate must be a string with at least 6 characters");
            }
        }

        console.log("plate after processing:", plate);
        
        const payload = {
            user_id: userId,
            ownership_type: ownership_type,
            weekly_rent_amount: ownership_type === "OWNED" ? null : weeklyRentAmount,
            alias: alias,
            plate: plate
        }

        const statusOk201Request = (data:any) => Response.json({ ok: true, data }, { status: 201 });
        
        return statusOk201Request(payload); //Temporalmente devuelvo el body recibido para debuggear antes de hacer la insercion en la base de datos

    } catch (e) {
        console.log(e);
        return Response.json({ ok: false, error: { code: "INTERNAL_ERROR", message: "Database error" } }, { status: 500 });
    }
}