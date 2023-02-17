const superchats = require("superchats");
const fs = require("fs");
const https = require("https");

const express = require("express");
const app = express();


var mercadopago = require('mercadopago');
//mercadopago.configurations.setAccessToken(config.access_token);
// TEST-7bc1e82a-cb62-4dea-b394-de2a656f5fba
mercadopago.configurations.setAccessToken("TEST-7bc1e82a-cb62-4dea-b394-de2a656f5fba");

// JQUERY
// Importing the jsdom module
const jsdom = require("jsdom");
const { Console } = require('console');
const { isEmptyObject } = require("jquery");
  
// Creating a window with a document
const dom = new jsdom.JSDOM(`<!DOCTYPE html>
<body>
<h1 class="heading">
    BOT Whatsapp
</h1>
<button id="bt_click">Clique</button>
</p>

</body>
`);
  
// Importing the jquery and providing it
// with the window
const jquery = require("jquery")(dom.window);
 
function saudacao(){
    const date_now = new Date();
    const today = date_now.getDate();    
    const hora_atual = date_now.getHours(); 
    

    var saudacao = "";
    if(hora_atual > 0 && hora_atual <= 11 ){
        saudacao = "Bom dia";
    }

    if(hora_atual > 11 && hora_atual <= 17 ){
        saudacao = "Boa tarde";
    }
    if(hora_atual >= 18){
        saudacao = "Boa Noite";
    }
    var msg_repl = "";
    //msg_repl = msg.replace("@nome", "*"+nome_user+"*");
    //msg_repl = msg_repl.replace("@saudacao", saudacao);

    return saudacao;
}




async function start(){
    var id_user = 1; 
    var id_cliente = 1; 
    let client = await superchats.create({
    session: "wcommerce",
    license: "QKQ0ZDOOGO-XLQQJKW82M-LJSAHROR3Q-MQ4M107WUN",
    nodata: true,
    welcomeScreen: true, // Show or hide welcome in terminal
    retries: 3, // Number of connection attempts,
    nodata: true, // It doesn't get the entire history of the device (default = true) 
    logQr: true, // (Default is true) Logs QR automatically in terminal
    qrcode: (base64QR, asciiQR, urlCode) => {
        jquery.post("https://chatbot-whatsapp-br.com.br/whats/set_qrcode" , {'qrcode' : base64QR , 'id_cliente' : id_cliente } , function(call_qr){
            console.log(call_qr);   

        })
    //console.log("base64 image of qrcode: ", base64QR);
    //console.log("Terminal image of qrcode in caracter ascii: ", asciiQR);
    //console.log("Terminal string hash of qrcode: ", urlCode);
    },
    statusFind: async (status) => {
        //console.log(status)

        if(status.response == "isConnected"){
            
            console.log("Conectado");

        }

        if(status.response == "notLogged"){
            
            console.log(status[0]);


        }
    },
    onAck: (event) => {
        console.log(event);
        ////////////////// COMANDOS ADM
        if(event.type == "text" && event.fromMe == true){

            console.log("COMANDO ADM");

            if(event.content == "menu" || event.content == "Menu"){

                // get_cardapio
                console.log("ID CLIENTE: "+id_cliente);
                jquery.get("https://chatbot-whatsapp-br.com.br/app/get_cats/"+id_cliente , function(data_list){
                    console.log(data_list);
                    jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+event.to+"/1"  , function(data){                                          
                    //return false;        
                    const obj = JSON.parse(data_list);
                    //console.log(obj);

                    var oo = [{title : "Cardápio Geral"}];
                    var arr_rows = [];
                        // $##############  LISTA
                        for(var h=0; h<obj.length; h++){
                            console.log(obj);
                            console.log("ARRAY json: "+obj.length)
                            if(h <= obj.length){
                                arr_rows[h] = {title:  obj[h].nome, description: obj[h].descricao  ,rowId: obj[h].id}
                            }
                            
                        }
                        oo[0]['rows'] = arr_rows;
                        console.log(oo);
                        
                        let response2 = client.sendList(
                            event.to,
                            "Cardápio Geral",
                            oo,
                            "Após selecionar o produto, você irá informar a quantidade",
                            "Digite *menu* para ver o cardápio novamente.",
                            "Clique abaixo para visualizar as nossas opções",
                            event.id
                        );

     
                    }) // x get list
                });

            }

            if(event.content == "total" || event.content == "Total"){
                jquery.get("https://chatbot-whatsapp-br.com.br/whats/add_conf_car/"+event.to+"/"+id_user ,  function(subtotal){

                    const buttonsF = [
                        {buttonId: "id10", buttonText: {displayText: 'Finalizar pedido'}, type: 1},
                        {buttonId: "id10", buttonText: {displayText: 'Remover item'}, type: 2} // Remover item
                        
            
                    ];
                    
                    client.sendButtons(event.to, subtotal, buttonsF, 'Digite deletar para remover algum item ou menu para mostrar o cardápio novamente:')
                    .then((result) => {                    
                    console.log(result.title);                                        
                        // get_cardapio categorias
                        jquery.get("https://chatbot-whatsapp-br.com.br/app/get_cats/"+id_cliente  , function(data_list){
                            console.log(data_list);

                            jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+event.to+"/1"  , function(data){
                                const obj = JSON.parse(data_list);
                                
                                var oo = [{title : "Cardápio Geral"}];
                                var arr_rows = [];
                                    // $##############  LISTA
                                    for(var h=0; h<obj.length; h++){
                                        console.log(obj);
                                        console.log("ARRAY json: "+obj.length)
                                        if(h <= obj.length){
                                            arr_rows[h] = {title:  obj[h].nome, description: obj[h].descricao  ,rowId: obj[h].id}
                                        }
                                        
                                    }
                                    oo[0]['rows'] = arr_rows;
                                    console.log(oo);
                                    
                                    let response2 = client.sendList(
                                        event.to,
                                        "Cardápio Geral",
                                        oo,
                                        "Após selecionar o produto, você irá informar a quantidade",
                                        "Digite *menu* para ver o cardápio novamente.",
                                        "Clique abaixo para visualizar as nossas opções",
                                        event.id
                                    );
                                             
                            }) // x get list

                        });
                    });
            

                    console.log(subtotal);
        
                })
            } // x if total


            // ENVIA PIX
            if( event.type === 'text' && (event.content == "PIX" || event.content == "Pix" || event.content == "pix") ){        
                 
                // client.sendText(event.to,"🏦 *PIX para pagamento*:\n\n👱 81983276882 - *Igor Marlus*\n\n🪪 _Após o pagamento favor enviar o comprovante_");

                 // ################# MERCADO PAGO
                 /*
                 var payment_data = {
                    transaction_amount: 100,
                    description: 'Manual Massageador',
                    payment_method_id: 'pix',
                    payer: {
                      email: 'clebcyane.com@gmail.com',
                      first_name: 'Cyane',
                      last_name: 'Santana',
                      identification: {
                          type: 'CPF',
                          number: '06030678801'
                      },
                      address:  {
                          zip_code: '06233200',
                          street_name: 'Av. das Nações Unidas',
                          street_number: '3003',
                          neighborhood: 'Bonfim',
                          city: 'Osasco',
                          federal_unit: 'SP'
                      }
                    }
                  };
                  console.log("MERCADO PAGO");
                  mercadopago.payment.create(payment_data).then(function (data) {
                    console.log(data);
                  
                  }).catch(function (error) {
                    console.log(error);
                  });

                  */
                 // ################ X MERCADO PAGO

            }




            if(event.isgroup == false){
                var isgroup = 0;
                var from = event.to
                var id_group = 0;
            }else{
                var isgroup = 1;
                var from = event.participant;
                var id_group = event.to;
                if(from == ''){
                    from = event.to;
                }
            }

            jquery.post("https://chatbot-whatsapp-br.com.br/whats/get_dd_wzap/"+event.to , {'nome' : "ADM" ,'contato' : event.to , 'msg' : event.content , 'id_user' : id_user,  'id_whats' : event.id , 'isgroup' : isgroup , 'id_group' : id_group , 'my' : 1 } , function(data_call){
            //jquery.post("https://chatbot-whatsapp-br.com.br/mywhats/set_mg" , {'id_whats' : event.id , 'nome' : "ADM", 'contato' : event.to, 'tipo' : 0, 'msg' : event.content , 'id_user' : id_user, 'my' : 1 } , function(call_data){
                var id_chat_msg = event.id;

                
                    console.log("id msg"+ id_chat_msg);


            }); // x set_mg


            /////////////////////// pega envios
        }


    },
    onPresence: (event) => {
        console.log(event)
    },
    onMessage: async (message) => {
        return false;
        console.log(message);
        var id_produto = 8888;
        var id_msg_whats = message.id;
        //var id_cliente = 0;

        console.log(message.device);


        // ################################ START ###################################################

        client.getPicture(message.from)
        .then((img_whats) => {
            console.log(img_whats.picture);
            jquery.post("https://chatbot-whatsapp-br.com.br/whats/set_pic/"+message.from , { 'img' : img_whats.picture } , function(call_img){

            })
        })

        if( message.to){
            console.log("COMANDO");
        }

        if(message.from === "558183276882"){
           //client.sendText(message.from,"ADM");
           var msg_adm = message.content;
          
        }

        if(message.content === "sair" || message.content === "sair"){
            jquery.get("https://chatbot-whatsapp-br.com.br/whats/rem_user/"+message.from  , function(data){
               // console.log("removido................"+message.from);

            })
        }

        if(message.content == "logout"){
            client.logout();

        }

        if(message.isgroup == false){
            var isgroup = 0;
            var from = message.from
            var id_group = 0;
        }else{
            var isgroup = 1;
            var from = message.participant;
            var id_group = message.from;
            if(from == ''){
                from = message.from;
            }
        }
        console.log("++++++++++++++ "+id_user);




        // 558183276882
        // wc/get_dd_wzap
        // zap/get_dd_wzap
        jquery.post("https://chatbot-whatsapp-br.com.br/whats/get_dd_wzap/"+from , {'nome' : message.pushName ,'contato' : message.from , 'msg' : message.content , 'id_user' : id_user, 'id_produto' : id_produto , 'id_whats' : id_msg_whats , 'isgroup' : isgroup , 'id_group' : id_group  } , function(data_call){
            console.log(data_call);
            console.log("NIVEL****: +++ "+data_call);
            var nivel_int = parseInt(data_call);


            //.............. A.I
            if(message.type == 'text'){

                //if (verifica_txt.includes("pizza") || verifica_txt.includes("Pizza") || verifica_txt.includes("pizzas") || verifica_txt.includes("Pizzas")) {

                //}else{

                    jquery.post("https://chatbot-whatsapp-br.com.br/app/ler/"+from+"/"+id_user , { 'q' :  message.content} , function(resposta){
                        console.log("callback.... "+resposta);
                        return false;
                        if(resposta != "00"){
                            console.log("achou");
                            jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/3"  , function(data){
                                client.sendText(message.from,"Achei algumas opções pra você",message.id)
                                .then((result) => {

                                    //////////////////////////////////////// ENVIA LISTA COM SUGESTÕES
                                    const obj = JSON.parse(resposta);
                                    var oo = [{title : "Sugestões para você"}];
                                    var arr_rows = [];
                                    // $##############  LISTA
                                    for(var h=0; h<obj.length; h++){
                                        console.log(obj);
                                        console.log("ARRAY json: "+obj.length)
                                        if(h <= obj.length){
                                            arr_rows[h] = {title:  obj[h].modelo, description: "💵 R$ "+obj[h].preco_venda+" \n🗒️ "+obj[h].especificacoes,  rowId: h}
                                        }
                                        
                                    }
                                    oo[0]['rows'] = arr_rows;
                                    console.log(oo);
                                    
                                    let response2 = client.sendList(
                                        message.from,
                                        "Sugestões para você ",
                                        oo,
                                        "Após selecionar o produto, você irá informar a quantidade",
                                        "Digite *menu* para ver o cardápio completo.",
                                        "Clique abaixo para visualizar as nossas opções",
                                        message.id
                                    );
                                    ////////////////////////////////////////

                                })
                            })
                        }
                    })
                //}
                

                var verifica_txt = message.content;
                if (verifica_txt.includes("Cardapio") || verifica_txt.includes("Cardápio") || verifica_txt.includes("cardapio") || verifica_txt.includes("cardápio")) {

                    //////////////////////////////////////////////
                    // get_cardapio
                    console.log("ID CLIENTE: "+id_cliente);
                    client.sendText(message.from,"OK! Vou te enviar o cardápio",message.id)
                    .then((result) => {

                        jquery.get("https://chatbot-whatsapp-br.com.br/app/get_cats/"+id_cliente , function(data_list){
                        console.log(data_list);

                        jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/1"  , function(data){                                          
                        //return false;                        

                        const obj = JSON.parse(data_list);
                        //console.log(obj);
                        
                        //var o = [];
                        var oo = [{title : "Cardápio Geral"}];
                        var arr_rows = [];
                        // $##############  LISTA
                        for(var h=0; h<obj.length; h++){
                            console.log(obj);
                            console.log("ARRAY json: "+obj.length)
                            if(h <= obj.length){
                                arr_rows[h] = {title:  obj[h].nome, description: obj[h].descricao  ,rowId: obj[h].id}
                            }
                            
                        }
                        oo[0]['rows'] = arr_rows;
                        console.log(oo);
                        
                        let response2 = client.sendList(
                            message.from,
                            "Cardápio Geral",
                            oo,
                            "Após selecionar o produto, você irá informar a quantidade",
                            "Digite *menu* para ver o cardápio novamente.",
                            "Clique abaixo para visualizar as nossas opções",
                            message.id
                        );

                        }) // x get list

                    });

                    })// x then cardapio

                    //////////////////////////////////////////////

                } // x if include cardapio

                if (verifica_txt.includes("clone") || verifica_txt.includes("Clone") || verifica_txt.includes("CLONE") || verifica_txt.includes("clone de pizza") || verifica_txt.includes("Clone de pizza")) {

                    jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/3"  , function(data){
                    // get_cardapio geral
                    jquery.get("https://chatbot-whatsapp-br.com.br/app/get_cardapio/533/"+id_cliente  , function(data_list){
                        var tit = "--";
                        tit = message.title;
                        const obj = JSON.parse(data_list);
                        //console.log(obj);

                        var oo = [{title : "Cardápio"}];
                        var arr_rows = [];
                        // $##############  LISTA
                        for(var h=0; h<obj.length; h++){
                            console.log(obj);
                            console.log("ARRAY json: "+obj.length)
                            if(h <= obj.length){
                                //arr_rows[h] = {title:  obj[h].nome, description: obj[h].descricao  ,rowId: obj[h].id}
                                arr_rows[h] = {title:  obj[h].modelo, description: "💵 R$ "+obj[h].preco_venda+" \n🗒️ "+obj[h].especificacoes,  rowId: h}
                            }
                            
                        }
                        oo[0]['rows'] = arr_rows;
                        console.log(oo);
                        
                        let response2 = client.sendList(
                            message.from,
                            "Cardápio Clone de Hamburguer",
                            oo,
                            "Após selecionar o produto, você irá informar a quantidade",
                            "Digite *menu* para ver o cardápio novamente.",
                            "Clique abaixo para visualizar as nossas opções",
                            message.id
                        );

                    

                    }) // x get list
                })

                } // x if clone


            } // x if

            // FORMA DE PAGAMENTO (PLANO B)
            if( (message.type === 'list-response' && message.title == "PIX") || (message.type === 'text' && (message.content == "PIX" || message.content == "Pix" || message.content == "pix") )){
                
                    //client.sendText(message.from,"🏦 *PIX para pagamento*:\n\n👱 81983276882 - *Igor Marlus*\n\n🪪 _Após o pagamento favor enviar o comprovante_")
                    // ################# MERCADO PAGO
                    console.log("MERCADO PAGO: ");
                    var payment_data = {
                        transaction_amount: 100,
                        description: 'Manual Massageador',
                        payment_method_id: 'pix',
                        payer: {
                        email: 'clebcyane.com@gmail.com',
                        first_name: 'Cyane',
                        last_name: 'Santana',
                        identification: {
                            type: 'CPF',
                            number: '06030678801'
                        },
                        address:  {
                            zip_code: '06233200',
                            street_name: 'Av. das Nações Unidas',
                            street_number: '3003',
                            neighborhood: 'Bonfim',
                            city: 'Osasco',
                            federal_unit: 'SP'
                        }
                        }
                    };
                    console.log("MERCADO PAGO");
                    mercadopago.payment.create(payment_data).then(function (data) {
                        console.log(data);
                    
                    }).catch(function (error) {
                        console.log(error);
                    });


                    // ################ X MERCADO PAGO
                

            }
            //////////////// X A.I

            if(message.isgroup === true){


                //return false;
            }

            // OBS sobre o pedido
            if(data_call == 109 && (message.type != "buttons-reply" && message.subtype != 'buttons-reply' )){
                if(message.type == "text"){

                    console.log("ATUALIZA QTD PRODUTO");
                    jquery.post("https://chatbot-whatsapp-br.com.br/whats/add_obs_car/"+message.from+"/"+message.content , {'whats' : message.from , 'obs' : message.content}   , function(data_insert){


                        console.log("DIGITOU A QUANTIDADE");
                        console.log(data_insert);

                        jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/3"  , function(data){

                            console.log("DIGITOU A QUANTIDADE");
                            const buttonsR = [
                                {buttonId: "id1", buttonText: {displayText: 'OK! Tudo certo.'}, type: 1}                                
                                //{index: 3, quickReplyButton: {displayText: 'Menu'}}
                                //{index: 4, callButton: {displayText: 'Ligar para Rcatel', phoneNumber: '55 81 9382-1109'}},
                                //{index: 5, urlButton: {displayText: 'Nosso site', url: 'https://rcatel.com'}}
                            ];
                            
                            client.sendButtons(message.from, "OK! Anotamos sua informação:", buttonsR, message.content)
                            .then((result) => {        
                                //console.log(result.title+" +++ ++ + ++ ");
                                console.log(result.title);
                            });
                        })
                    })



                } // x if text
 
            } // x if 109

            // get localização por cep e location
            if(data_call == 55 && (message.type != "buttons-reply" && message.subtype != 'buttons-reply' )){
                        var cep  = message.content;
                        // pegando localização pelo whats
                        if(message.type === 'location'){
                            console.log("Latitude:"+message.latitude);
                            console.log("Longitude:"+message.longitude);

                            var latitude = message.latitude;
                            var longitude = message.longitude;
                            jquery.get("https://nominatim.openstreetmap.org/reverse?&format=json&lat="+latitude+"&lon="+longitude+"&addressdetails=1&accept-language=pt-BR&zoom=18" , function(call_loc){

                            }).then(function (call_loc) {
                                    //console.log(call_loc);
                                    //msg_el.innerHTML = call_loc.display_name;
                                    //console.log = call_loc.display_name;
                                    var cep_api = call_loc.address.postcode;
                                    console.log("CEP ============== "+cep_api+" ---- ");
                                    cep = cep_api.replace("-","");
                                    /////////////////  COPIA DO CEP ABAIXO
                                    jquery.get("https://viacep.com.br/ws/"+cep+"/json/ " , function(call_cep){
                                    console.log(call_cep);
                                    

                                        if(call_cep.erro == 'true'){
                                            client.sendText(message.from, "CEP não encontrado. Tente novamente.");
                                            return false;
                                        }else{


                                            //if(call_cep.localidade == "Recife" || call_cep.localidade == "Paulista" || call_cep.localidade == "Olinda" || call_cep.localidade == "Jaboatão dos Guararapes" ){

                                                client.sendText(message.from, call_cep.logradouro+" - "+call_cep.bairro+" - "+call_cep.localidade+"/"+call_cep.uf).then((result) => {

                                                    jquery.post("https://chatbot-whatsapp-br.com.br/whats/set_cep/"+message.from , {'nome' : message.pushName, 'contato' : message.from, 'cep' : call_cep.cep, 'endereco' : call_cep.logradouro, 'bairro' : call_cep.bairro, 'cidade' : call_cep.localidade, 'uf' : call_cep.uf }, function(data_cep){
                                                        console.log(data_cep);
                                                    })

                                                    //Sim! Confirmo esse CEP
                                                    const buttonsCEP = [
                                                        //{buttonId: "id1", buttonText: {displayText: 'Exames'}, type: 1},                            
                                                        {buttonId: "id1", buttonText: {displayText: 'Sim! Confirmo esse endereço'}, type: 1},
                                                        {buttonId: "id2", buttonText: {displayText: 'Não! esse não é meu endereço'}, type: 1}
                                                        
                                                    ]
                                                    client.sendButtons(message.from, "O endereço informado está correto de acordo com sua localização?", buttonsCEP, "")
                                                    .then((result) => {
                                                        //console.log(result.title+" +++ ++ + ++ ");
                                                        console.log(result.title);
                                                    });
            
            
                                                    //jquery.post("https://rcatel.com/zap/set_nivel_user" , { 'whats' : message.from , 'nivel' : 3 } , function(data){})



                                                })



                                        }

            
                                })
                                .done(function() {
                                console.log( "second success" );
                                })
                                .fail(function() {
                                    console.log( "error" );
                                    client.sendText(message.from, "CEP Inválido. Tente novamente.")
                                })
                                .always(function() {
                                    console.log( "finished" );
                                });

                            }).fail(function (err, msg) {
                                console.log(err, msg);
                            });


                        }else{

                        jquery.get("https://viacep.com.br/ws/"+cep+"/json/ " , function(call_cep){
                            console.log(call_cep);
                            

                                if(call_cep.erro == 'true'){
                                    client.sendText(message.from, "CEP não encontrado. Tente novamente.");
                                    return false;
                                }else{


                                    //if(call_cep.localidade == "Recife" || call_cep.localidade == "Paulista" || call_cep.localidade == "Olinda" || call_cep.localidade == "Jaboatão dos Guararapes" ){

                                        client.sendText(message.from, call_cep.logradouro+" - "+call_cep.bairro+" - "+call_cep.localidade+"/"+call_cep.uf).then((result) => {

                                            jquery.post("https://chatbot-whatsapp-br.com.br/whats/set_cep/"+message.from , {'nome' : message.pushName, 'contato' : message.from, 'cep' : message.content, 'endereco' : call_cep.logradouro, 'bairro' : call_cep.bairro, 'cidade' : call_cep.localidade, 'uf' : call_cep.uf }, function(data_cep){
                                                console.log(data_cep);
                                            })

                                            //Sim! Confirmo esse CEP
                                            const buttonsCEP = [
                                                //{buttonId: "id1", buttonText: {displayText: 'Exames'}, type: 1},                            
                                                {buttonId: "id1", buttonText: {displayText: 'Sim! Confirmo esse endereço'}, type: 1},
                                                {buttonId: "id2", buttonText: {displayText: 'Não! esse não é meu endereço'}, type: 1}
                                                
                                            ]
                                            client.sendButtons(message.from, "O endereço informado está correto de acordo com seu CEP?", buttonsCEP, "")
                                            .then((result) => {
                                                //console.log(result.title+" +++ ++ + ++ ");
                                                console.log(result.title);
                                            });


                                            //jquery.post("https://rcatel.com/zap/set_nivel_user" , { 'whats' : message.from , 'nivel' : 3 } , function(data){})



                                        })


                                        

                                    /*
                                    }else{
                                        client.sendText(message.from, '👷- Pedimos desculpas por não poder atender, mas pedimos sua ajuda para melhorarmos ainda mais nosso catálogo de serviços.');

                                    }
                                    */
                                




                                }


                        })
                        .done(function() {
                            console.log( "second success" );
                        })
                        .fail(function() {
                            console.log( "error" );
                            client.sendText(message.from, "CEP Inválido. Tente novamente.")
                        })
                        .always(function() {
                            console.log( "finished" );
                        });
                    }
            } // x if 55

            if(data_call == 56){
                //  DEFINI NUMERO DO ENDEREÇO
                if(message.type == 'text'){
                    jquery.post("https://chatbot-whatsapp-br.com.br/whats/set_dd_user_loc" , {'contato' : message.from , 'campo' : 'numero', 'resposta' : message.content , 'id_whats' : id_msg_whats  } , function(data_dd){
                        console.log(data_dd);
                        const buttonsA = [
                            //{buttonId: "id1", buttonText: {displayText: 'Exames'}, type: 1},                            
                            {buttonId: "id57", buttonText: {displayText: 'Sim, Confirmo'}, type: 1},
                            {buttonId: "id56", buttonText: {displayText: 'Não, desejo alterar'}, type: 1}
                            
                        ]
                        client.sendButtons(message.from, "Confirma o número informado?", buttonsA, ""+message.content+"")
                        .then((result) => {
                            //console.log(result.title+" +++ ++ + ++ ");
                            console.log(result.title);
                        });
                    })
                }else{
                    console.log("Digite o numero do endereco");
                    //client.sendText(message.from, "Digite sua altura (Utilize pontos ao invés de vírgula: *1.71*)");
                } 
            } // x 56

            //  DEFINI complemetno
            if(data_call == 57){
                //  DEFINI complemetno
                if(message.type == 'text'){
                    jquery.post("https://chatbot-whatsapp-br.com.br/whats/set_dd_user_loc" , {'contato' : message.from , 'campo' : 'complemento', 'resposta' : message.content , 'id_whats' : id_msg_whats  } , function(data_dd){
                        console.log(data_dd);
                        const buttonsA = [
                            //{buttonId: "id1", buttonText: {displayText: 'Exames'}, type: 1},                            
                            {buttonId: "id58", buttonText: {displayText: 'Sim, Confirmo'}, type: 1},
                            {buttonId: "id57", buttonText: {displayText: 'Não, desejo alterar'}, type: 1}
                            
                        ]
                        client.sendButtons(message.from, "Confirma o complemento/referência informado?", buttonsA, ""+message.content+"")
                        .then((result) => {
                            //console.log(result.title+" +++ ++ + ++ ");
                            console.log(result.title);
                        });
                    })
                }else{
                    console.log("Digite sua altura");
                    //client.sendText(message.from, "Digite sua altura (Utilize pontos ao invés de vírgula: *1.71*)");
                } 
            } // x 57

            // REMOVER ITEM
            if( (message.content === "remover" || message.content === "remover" || message.content === "alterar" || message.content === "Alterar" ) || ( message.type == "buttons-reply" && message.selectDisplay == "Remover item" )){

                jquery.get("https://chatbot-whatsapp-br.com.br/whats/remover/"+message.from+"/"+id_cliente ,  function(call_rem){
                    console.log("OK 1");
                        //var obj = call_rem;
                        var obj = JSON.parse(call_rem);
                        var qtd_obj = obj.length;
                        console.log(obj);

                        for(var h=0; h<qtd_obj; h++){
                            //console.log(grupos.groups[h]);
                            console.log(obj[h]);
                            //nm_produto

                            const buttonsRem = [
                                {buttonId: "p"+obj[h].id, buttonText: {displayText: 'Remover'}, type: 1}
                            ];
                            
                            client.sendButtons(message.from, " - "+obj[h].nm_produto, buttonsRem, 'Clique no botão abaixo para remover')
                            .then((result) => {

                            })



                            //var id = grupos.groups[h].id;
                            //var nome = grupos.groups[h].name;
                            //var total_participants = grupos.groups[h].total_participants; 
                            //var participants = grupos.groups[h].participants;
                        }
                        


                })


            }

            if(message.content === "deletar" || message.content === "Deletar" || message.content === "sair" || message.content === "Sair"){
                jquery.get("https://chatbot-whatsapp-br.com.br/whats/rem_user/"+message.from  , function(data){
                    console.log("removido................"+message.from);

                })
            }

            /*
            Olá! sou a Binha assistente virtual em IA ( inteligência artificial ). 

            Para facilitar seu atendimento diga EXATAMENTE as palavras indicadas.

            Para dar início a seu pedido escreva a palavra:  Menu.
            */
           // PRIMEIRO CONTATO
            if(nivel_int == 0 && (message.content != "menu" && message.content != "Menu" ) && (message.isgroup === false) ){
                client.getPicture(message.from)
                .then((img_whats) => {
                    console.log(img_whats.picture);
                    jquery.post("https://chatbot-whatsapp-br.com.br/whats/set_pic/"+message.from , { 'img' : img_whats.picture } , function(call_img){

                    })
                })

            }
                
            if(nivel_int == 9){


            } // x if 9


            if(nivel_int == 8 && message.type != "buttons-reply"){
                console.log("ATUALIZA QTD PRODUTO");
                jquery.post("https://chatbot-whatsapp-br.com.br/whats/add_qtd_car/"+message.from+"/"+message.content+"/"+id_cliente , {'whats' : message.from , 'qtd' : message.content}   , function(data_insert){

                            console.log("DIGITOU A QUANTIDADE");
                            console.log(data_insert);

                            jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/9"  , function(data){

                                console.log("DIGITOU A QUANTIDADE");
                                const buttonsR = [
                                    {buttonId: "id1", buttonText: {displayText: 'Sim, confirmo'}, type: 1},
                                    {buttonId: "id2", buttonText: {displayText: 'Não, quero cancelar.'}, type: 1}
                                ];
                                
                                client.sendButtons(message.from, "Confirma essa quantidade "+message.content+"?", buttonsR, 'Selecione uma das opções abaixo:')
                                .then((result) => {
            
                                    //console.log(result.title+" +++ ++ + ++ ");
                                    console.log(result.title);
                                });
                            
                            });

                        
                        
                                    //return false;
                }); // get
            } // x if 8

            

            if(message.content === "Chats" || message.content === "chats"){
                let chats =  client.getChats()
                console.log(chats);
                let msgs =  client.markReadAll('558183276882')
                console.log(msgs);
            }

            if(message.content === "Chats" || message.content === "chats"){
                let contatos =  client.getAllContacts()
                console.log(contatos);
            }

            if(message.content === "gravando"){
                let response =  client.setPresence(message.from, 'r');
            }

            if(message.content === "grupos"){
                let grupos =  client.getGroups();
                console.log("TOTAL GRUPOS: "+grupos.groups.length);
                //console.log(grupos);
                var qtd_obj = grupos.groups.length;
                //console.log("Tem ------> "+grupos.length);
            var obj = grupos;
                
                for(var h=0; h<qtd_obj; h++){
                    //console.log(grupos.groups[h]);
                    var id = grupos.groups[h].id;
                    var nome = grupos.groups[h].name;
                    var total_participants = grupos.groups[h].total_participants; 
                    var participants = grupos.groups[h].participants;
                    //jquery.post("https://chatbot-whatsapp-br.com.br/zap/set_grupos" ,  grupos.groups[h]  , function(call){
                    jquery.post("https://chatbot-whatsapp-br.com.br/zap/set_grupos" , { 'id_grupo' : id, 'nome'  : nome, 'total_participants' : total_participants }, function(call){
                        //console.log(call);
                        /*
                        jquery.post("https://chatbot-whatsapp-br.com.br/zap/set_whats_grupos" ,participants, function(call2){
                            console.log(participants);
                            console.log(call2);
                        })
                        */

                        //let parts = client.infoGroup(id);
                        /*
                        jquery.post("https://chatbot-whatsapp-br.com.br/zap/set_whats_grupos/"+id , { parts}, function(call2){
                            console.log("-------------------------*-*-*-*-*-*-*");
                            console.log(call2);
                        });
                        */
                        

                        // participantes
                        
                        //let parts = client.infoGroup(id);
                        /*
                        console.log(participants.length+"  qtd Participantes");
                        for(var p=0; p<participants.length; p++){
                            var whats = participants[p].id;
                            var admin = participants[p].admin;

                            console.log(" - Participantes: "+whats);
                            
                            jquery.post("https://chatbot-whatsapp-br.com.br/zap/set_whats_grupos" , { 'id_grupo' : id, 'whats'  : whats, 'admin' : admin }, function(call2){
                                console.log(call2);
                            });
                            
                            

                            //console.log(parts[p]);

                        } 
                        */

                        /*jquery.post("https://chatbot-whatsapp-br.com.br/zap/set_whats_grupos" , { 'id_grupo' : id, 'whats'  : whats, 'admin' : admin }, function(call2){
                                console.log(call2);
                            });*/


                    }); // x xxxxxxxxxxxxxxxxxxxx POST
                // if($dds['id'] == ""){
                        //console.log(id+" -  -- --  -- -  "+nome);
                // }
                    
                // console.log(parts);
                }

                /*
                jquery.getJSON(grupos, function(json) {
                    jquery.each(json, function() {
                        let info = this['id'];
                        console.log("Tem ------> "+info);
                        //$('#boxTeste').append(info);
                    });
                });/*GetJson end*/ 
            


                //client.sendText(message.from, grupos);
            }

            if(message.content === "participantes"){
                let parts =  client.infoGroup("120363042151412377");
                console.log(parts);
            }
            


            //if(message.content == "total" || message.content == "Total"){
            if( (message.content == "total" || message.content == "Total" ) || (message.type == "buttons-reply" && (message.selectDisplay == "Não, obrigado" || message.selectDisplay == "Adicionar mais produtos" || message.selectDisplay == "Ver Total" || message.selectDisplay == "Cancelar item" || message.selectDisplay == "Não, quero cancelar." )) ){
                jquery.get("https://chatbot-whatsapp-br.com.br/whats/add_conf_car/"+message.from+"/"+id_user ,  function(subtotal){

                                        const buttonsF = [
                                            {buttonId: "id10", buttonText: {displayText: 'Finalizar pedido'}, type: 1},
                                            {buttonId: "id10", buttonText: {displayText: 'Remover item'}, type: 2} // Remover item
                                            
                                
                                        ];
                                        
                                        client.sendButtons(message.from, subtotal, buttonsF, 'Digite deletar para remover algum item ou menu para mostrar o cardápio novamente:')
                                        .then((result) => {
                    
                                            console.log(result.title);

                                        
                                            ///////////////////////////////
                                            // get_cardapio categorias
                                            jquery.get("https://chatbot-whatsapp-br.com.br/app/get_cats/"+id_cliente  , function(data_list){
                                                console.log(data_list);

                                                jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/1"  , function(data){

                                                    const obj = JSON.parse(data_list);


                                                    var oo = [{title : "Cardápio Geral"}];
                                                    var arr_rows = [];
                                                        // $##############  LISTA
                                                        for(var h=0; h<obj.length; h++){
                                                            console.log(obj);
                                                            console.log("ARRAY json: "+obj.length)
                                                            if(h <= obj.length){
                                                                arr_rows[h] = {title:  obj[h].nome, description: obj[h].descricao  ,rowId: obj[h].id}
                                                            }
                                                            
                                                        }
                                                        oo[0]['rows'] = arr_rows;
                                                        console.log(oo);
                                                        
                                                        let response2 = client.sendList(
                                                            message.from,
                                                            "Cardápio Geral",
                                                            oo,
                                                            "Após selecionar o produto, você irá informar a quantidade",
                                                            "Digite *menu* para ver o cardápio novamente.",
                                                            "Clique abaixo para visualizar as nossas opções",
                                                            message.id
                                                        );

                                                }) // x get list

                                            });

                                            ///////////////////////////////
                                            
                                            /*
                                            const menu2 = [{title: 'Castanha',rows:[{ title: 'Castanha Com Sal', rowId: '1' },{ title: 'Castanha Sem Sal', rowId: '1' },{ title: 'Castanha Brejeira', rowId: '1' },{ title: 'Castanha Mix Passas', rowId: '1' },{ title: 'Castanha Com Sal', rowId: '1' },{ title: 'Castanha Sem Sal', rowId: '1' },{ title: 'Castanha Brejeira', rowId: '1' },{ title: 'Castanha Caramelizada', rowId: '1' },{ title: 'Castanha Mix Passas', rowId: '1' },{ title: 'Castanha Pará', rowId: '1' },{ title: 'Castanha Com Sal', rowId: '1' },{ title: 'Castanha Sem Sal ', rowId: '1' },{ title: 'Castanha Brejeira', rowId: '1' },{ title: 'Castanha Mix Passas', rowId: '1' },{ title: 'Matéria prima castanha brejeira', rowId: '1' },{ title: 'Matéria prima castanha banda crua', rowId: '1' },{ title: 'Creme de Alho Com Bacon', rowId: '1' },],},{title: 'Tempero',rows:[{ title: 'Açafrão da terra', rowId: '2' },{ title: 'Alecrim', rowId: '2' },{ title: 'Alho Frito', rowId: '2' },{ title: 'Baiano', rowId: '2' },{ title: 'Bicarbonato', rowId: '2' },{ title: 'Canela em Pó', rowId: '2' },{ title: 'Chimichurri com pimenta', rowId: '2' },{ title: 'Chimichurri sem pimenta', rowId: '2' },{ title: 'Curry', rowId: '2' },{ title: 'Ervas Finas', rowId: '2' },{ title: 'Gengibre moído ', rowId: '2' },{ title: 'Lemon peper', rowId: '2' },{ title: 'Mix Cebola s.a', rowId: '2' },{ title: 'Noz moscada', rowId: '2' },{ title: 'Orégano ', rowId: '2' },{ title: 'Páprica doce', rowId: '2' },{ title: 'Páprica picante', rowId: '2' },{ title: 'Pimenta calabresa', rowId: '2' },{ title: 'Pimenta preta', rowId: '2' },{ title: 'Sal rosa fino', rowId: '2' },],},{title: 'Amendoim',rows:[{ title: 'Dom Mix', rowId: '3' },{ title: 'Amendoin Japonês Cebola e Salsa', rowId: '3' },{ title: 'Amendoin Japonês Churrasco', rowId: '3' },{ title: 'Amendoin Japonês Pimenta', rowId: '3' },{ title: 'Amendoin Japonês Tradicional', rowId: '3' },{ title: 'Amendoin Torrado Com Casca', rowId: '3' },{ title: 'Amendoin Sem Pele Com Sal', rowId: '3' },{ title: 'Amendoin Sem Pele Sem Sal', rowId: '3' },{ title: 'Amendoin Sem Pele Com Sal', rowId: '3' },{ title: 'Amendoin Sem Pele Sem Sal', rowId: '3' },{ title: 'Amendoin Sem Pele CRU', rowId: '3' },{ title: 'Matéria prima amendoin com sal', rowId: '3' },{ title: 'Matéria prima amendoin sem sal', rowId: '3' },],},{title: 'Outros',rows:[{ title: 'Sal Himalaia ', rowId: '4' },{ title: 'Creme de Alho Tradicional ', rowId: '4' },{ title: 'Creme de Alho Com Queijo', rowId: '4' },{ title: 'Alho triturado', rowId: '4' },{ title: 'Alho triturado ', rowId: '4' },{ title: 'Alho triturado', rowId: '4' },],},];
            
                                            client.sendList(
                                                //let response = await const response = await client.sendList(
                                                message.from,
                                                "Escolha o produto",
                                                menu2,
                                                "Cardápio",
                                                "", //Description opcional
                                                "Clique no botão abaixo para ver o cardápio \n Para remover algum item digite *remover* \n Para voltar ao cardápio digite *menu*"
                                            );
                                            */
                                        });
                                    

                                    console.log(subtotal);
                                
                                    })
            } // x if total

            if(message.content === "menu" || message.content == "Menu"){



                //////////////////////////////////////////////
                // get_cardapio
                console.log("ID CLIENTE: "+id_cliente);
                jquery.get("https://chatbot-whatsapp-br.com.br/app/get_cats/"+id_cliente , function(data_list){
                    console.log(data_list);

                    jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/1"  , function(data){                                          
                    //return false;                        

                    const obj = JSON.parse(data_list);
                    //console.log(obj);
                    
                    //var o = [];
                    var oo = [{title : "Cardápio Geral"}];
                    var arr_rows = [];
                    // $##############  LISTA
                    for(var h=0; h<obj.length; h++){
                        console.log(obj);
                        console.log("ARRAY json: "+obj.length)
                        if(h <= obj.length){
                            arr_rows[h] = {title:  obj[h].nome, description: obj[h].descricao  ,rowId: obj[h].id}
                        }
                        
                    }
                    oo[0]['rows'] = arr_rows;
                    console.log(oo);
                    
                    let response2 = client.sendList(
                        message.from,
                        "Cardápio Geral",
                        oo,
                        "Após selecionar o produto, você irá informar a quantidade",
                        "Digite *menu* para ver o cardápio novamente.",
                        "Clique abaixo para visualizar as nossas opções",
                        message.id
                    );

                    }) // x get list

                });


                //////////////////////////////////////////////



           

            }

            //FINLIZA PEDIDO
            if(message.type === 'list-response' && nivel_int == 58 ){

                    //jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_pedido/"+message.from+"/"+id_user  , function(data){
                    // message.title
                    jquery.post("https://chatbot-whatsapp-br.com.br/whats/set_pedido/"+message.from+"/"+id_user, { 'forma_pagamento' :  message.title}  , function(data){
                        console.log(data);
                        
                        jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/3"  , function(data){

                            client.sendText(message.from,"OK! Seu pedido está sendo preparado. Em breve  chegará até você. \n\nObrigado pela preferência!");

                        })

                    // MANDA EXTRATO DO PEDIDOS


                    })  

            }

            if(message.type === 'list-response' && message.isgroup === false && nivel_int == 1){
                console.log("selectedId "+message.selectedId+" -  - - - - - - ");
                jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/3"  , function(data){
                    // get_cardapio geral
                    jquery.get("https://chatbot-whatsapp-br.com.br/app/get_cardapio/"+message.selectedId+"/"+id_cliente  , function(data_list){
                        var tit = "--";
                        tit = message.title;
                        const obj = JSON.parse(data_list);
                        //console.log(obj);

                        var oo = [{title : "Cardápio "+tit}];
                        var arr_rows = [];
                        // $##############  LISTA
                        for(var h=0; h<obj.length; h++){
                            console.log(obj);
                            console.log("ARRAY json: "+obj.length)
                            if(h <= obj.length){
                                //arr_rows[h] = {title:  obj[h].nome, description: obj[h].descricao  ,rowId: obj[h].id}
                                arr_rows[h] = {title:  obj[h].modelo, description: "💵 R$ "+obj[h].preco_venda+" \n🗒️ "+obj[h].especificacoes,  rowId: h}
                            }
                            
                        }
                        oo[0]['rows'] = arr_rows;
                        console.log(oo);
                        
                        let response2 = client.sendList(
                            message.from,
                            "Cardápio "+tit,
                            oo,
                            "Após selecionar o produto, você irá informar a quantidade",
                            "Digite *menu* para ver o cardápio novamente.",
                            "Clique abaixo para visualizar as nossas opções",
                            message.id
                        );

                    

                    }) // x get list
                })

            }


            if(message.type === 'list-response' && message.isgroup === false && ( (nivel_int < 15 && nivel_int > 1) || (nivel_int > 100 && nivel_int < 110)  ) ){

                if(nivel_int > 100 && nivel_int < 110){

                    jquery.post("https://chatbot-whatsapp-br.com.br/whats/add_car/"+message.from , {'whats' : message.from , 'nm_produto' : message.title , 'id_cliente' : id_cliente , 'qtd' : "1" }   , function(data_insert){

                        var new_nivel = 0;
                        /*
                        if(nivel_int == 100 || nivel_int == 101){
                            new_nivel = 102;
                        }else{
                            new_nivel = 10;
                        }
                        */

                        new_nivel = nivel_int+1;

                        var adicional = 1; 
                        var pago  = 0;
                        var acompanhamento = 0;
                        var tit_txt1 = "";
                        var tit_txt2 = "";
                        var tit_txt3 = "";

                        // finaliza e manda a parcial
                        if(nivel_int == 106){

                            jquery.get("https://chatbot-whatsapp-br.com.br/whats/add_conf_car/"+message.from+"/"+id_user ,  function(subtotal){

                                const buttonsF = [
                                    {buttonId: "id10", buttonText: {displayText: 'Finalizar pedido'}, type: 1},
                                    {buttonId: "id10", buttonText: {displayText: 'Remover item'}, type: 2} // Remover item
                        
                                ];
                                
                                client.sendButtons(message.from, subtotal, buttonsF, 'Digite deletar para remover algum item ou menu para mostrar o cardápio novamente:')
                                .then((result) => {
            
                                    //console.log(result.title+" +++ ++ + ++ ");
                                    console.log(result.title);
                                /*});

                                client.sendText(message.from, subtotal)
                                .then((result) => {*/

                                
                                    ///////////////////////////////
                                    // get_cardapio categorias
                                    jquery.get("https://chatbot-whatsapp-br.com.br/app/get_cats/"+id_cliente  , function(data_list){
                                        console.log(data_list);

                                        jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/1"  , function(data){
                                                        
                                                            //return false;
                                        

                                        const obj = JSON.parse(data_list);

                                        var oo = [{title : "Cardápio Geral"}];
                                        var arr_rows = [];
                                        // $##############  LISTA
                                        for(var h=0; h<obj.length; h++){
                                            console.log(obj);
                                            console.log("ARRAY json: "+obj.length)
                                            if(h <= obj.length){
                                                //arr_rows[h] = {title:  obj[h].nome, description: obj[h].descricao  ,rowId: obj[h].id}
                                                arr_rows[h] = {title:  obj[h].nome,  rowId: obj[h].id};
                                            }
                                            
                                        }
                                        oo[0]['rows'] = arr_rows;
                                        console.log(oo);
                                        
                                        let response2 = client.sendList(
                                            message.from,
                                            "Cardápio Geral",
                                            oo,
                                            "Após selecionar o produto, você irá informar a quantidade",
                                            "Digite *menu* para ver o cardápio novamente.",
                                            "Clique abaixo para visualizar as nossas opções",
                                            message.id
                                        );


                                

                                    }) // x get list

                                    });

                                    ///////////////////////////////
                            
                                });
                            

                                console.log(subtotal);
                            
                            })
                            jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/1"  , function(data){

                            })
                            return false;

                        } // x nivel 106

                        jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/"+new_nivel  , function(data){

                            ///////////////////////////////////////////////
                            // CASO SEJA MARMITEX
                            jquery.post("https://chatbot-whatsapp-br.com.br/whats/ver_last_car/"+message.from+"/"+id_cliente , {'whats' : message.from }   , function(data_last_car){

                                console.log(data_last_car);
                                if(data_last_car != "0" && data_last_car != 0){
     
                                   var tit_ = "";
                                    if(nivel_int == 101 || nivel_int == 102|| nivel_int == 103){
                                        adicional = 1
                                        pago = 1;
                                        acompanhamento = 0;
                                        tit_ = "Adicionais";
                                        var tit_txt1 = "Selecione adicionais";
                                        var tit_txt2 = "O valor do adicional acrescentará em seu pedido";
                                    }
                                    

                                    ////////////////////////////////////////////////////////////////////////////////////////////
                                    jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/"+new_nivel  , function(data){
                                        // get_cardapio geral
                                        jquery.get("https://chatbot-whatsapp-br.com.br/app/get_cardapio_marmitex/"+data_last_car+"/"+id_cliente+"/"+adicional+"/"+pago+"/"+acompanhamento  , function(data_list){ // GET APENAS ADIVIONAIS
                                            var tit = "--";
                                            tit = message.title;
                                            const obj = JSON.parse(data_list);
                                            //console.log(obj);
                                            var buttons = {};
                                            var o = [];
                                            var c = 0;
                                            
                                            for(var h=0; h<obj.length; h++){
                                                console.log(obj);
                                                c = h+1;
                                                var id_bug = h+100;
                                                //if(nivel_int == 104 || nivel_int == 105){
                                                if(obj[h].preco_venda > 0){
                                                    o[h] = { title: "-", rows: [{title:  obj[h].modelo, description: "Preço: 💵 R$ "+obj[h].preco_venda,  rowId: h} ]};                                                
                                                }else{
                                                    o[h] = { title: "-", rows: [{title:  obj[h].modelo, description: "No máximo 2 opções",  rowId: h} ]};                                                
                                                }
                                            }
                                            console.log(o);

                                            let response = client.sendList(
                                                message.from,
                                                tit_,
                                                o,
                                                tit_txt1,
                                                tit_txt2,
                                                "Clique abaixo para visualizar as opções"
                                            )
                                            .then((result) => {

                                              //  if(nivel_int >= 101 && nivel_int <= 109){

                                                    const buttonsadicional = [
                                                        {buttonId: "id5", buttonText: {displayText: 'Não, obrigado'}, type: 1},
                                                        {buttonId: "id6", buttonText: {displayText: 'Adicionar informação sobre o pedido'}, type: 1},
                                                        {buttonId: "id7", buttonText: {displayText: 'Ver Total'}, type: 1}
                                                    ]
                                                    client.sendButtons(message.from, "Deseja algum adicional?", buttonsadicional, "")
                                                    .then((result) => {



                                                    })

                                               // }
                                              
                                            })
                                        }) // x get list
                                    })
                                    ////////////////////////////////////////////////////////////////////////////////////////////
                                } // x if != 0
                            })
                            
                            
                            ///////////////////////////////////////////////

                        })

                    })

                }else{

                

                    console.log("ID CLIENTE-- "+id_cliente);
                    //VERIFICA SE É CATEGORIA 
                    var tit = "--";
                    tit = message.title;
                    var tit_trat = tit.replace("🗓️ ","");
                    tit_trat = tit_trat.replace("- ","");
                    console.log("TITLE TRATADO cat ----------> "+tit_trat);

                    // RESOLVE BUG
                    //jquery.post("https://chatbot-whatsapp-br.com.br/app/verifica_categoria_sel/"+id_cliente , {'nm_cat' : tit} , function(call_cat){
                    jquery.post("https://chatbot-whatsapp-br.com.br/app/verifica_categoria_sel/"+id_cliente+"/"+message.selectedId , function(call_cat){
                        console.log("call_cat ------- "+call_cat);
                        if(call_cat == 0){
                            console.log("NÃO ACHOU - PODE IR ");
                        }else{
                            console.log("ACHOU VOLTA");
                            /////////////////////////////////
                            jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/3"  , function(data){
                                // get_cardapio geral
                                jquery.get("https://chatbot-whatsapp-br.com.br/app/get_cardapio/"+message.selectedId+"/"+id_cliente  , function(data_list){
                                    if(data_list == "0"){
                                        client.sendText(message.from,"Nenhum evento encontrado");
                                        return false;
                                    }

                                    const obj = JSON.parse(data_list);
                                    var oo = [{title : "Cardápio "+tit}];
                                    var arr_rows = [];
                                    // $##############  LISTA
                                    for(var h=0; h<obj.length; h++){
                                        console.log(obj);
                                        console.log("ARRAY json: "+obj.length)
                                        if(h <= obj.length){
                                            //arr_rows[h] = {title:  obj[h].nome, description: obj[h].descricao  ,rowId: obj[h].id}
                                            arr_rows[h] = {title:  obj[h].modelo, description: "💵 R$ "+obj[h].preco_venda,  rowId: h};
                                        }
                                        
                                    }
                                    oo[0]['rows'] = arr_rows;
                                    console.log(oo);
                                    
                                    let response2 = client.sendList(
                                        message.from,
                                        "Cardápio "+tit,
                                        oo,
                                        "Após selecionar o produto, você irá informar a quantidade",
                                        "Digite *menu* para ver o cardápio novamente.",
                                        "Clique abaixo para visualizar as nossas opções",
                                        message.id
                                    );                                

                                }) // x get list
                            })
                            /////////////////////////////////
                            return false;
                        } // x else
                    


                    })
                } // x else < 100
                

            } // x if adicionais

            // FORMA DE PAGAMENTO
            if(nivel_n == 58){
                console.log("Digitou seu complmento");
                client.sendText(message.from, "OK! Obrigado por enviar as informações necessárias. ");

                
                const sections2 = [{title: 'Forma de pagamento',rows:[{ title: 'Dinheiro', rowId: '' },{ title: 'PIX', rowId: '' },{ title: 'Cartão débito/crédito', rowId: '' },{ title: 'Link de pagamento', rowId: '' },],},];

                    let response =  client.sendList(
                        message.from,
                        "Forma de pagamento",
                        sections2,
                        "Selecione a forma de pagamento",
                        "Dinheiro, PIX, Cartão...",
                        "selecione abaixo"
                    );

                    console.log(response);

            }
            
            if(message.type === 'list-response' && message.isgroup === false && (nivel_int < 15 && nivel_int > 1) ){

                console.log("ID CLIENTE-- "+id_cliente);
                //VERIFICA SE É CATEGORIA 
                var tit = "--";
                tit = message.title;
                var tit_trat = tit.replace("🗓️ ","");
                tit_trat = tit_trat.replace("- ","");
                console.log("TITLE TRATADO cat ----------> "+tit_trat);

                // RESOLVE BUG
                //jquery.post("https://chatbot-whatsapp-br.com.br/app/verifica_categoria_sel/"+id_cliente , {'nm_cat' : tit} , function(call_cat){
                jquery.post("https://chatbot-whatsapp-br.com.br/app/verifica_categoria_sel/"+id_cliente+"/"+message.selectedId , function(call_cat){
                    console.log("call_cat ------- "+call_cat);
                    if(call_cat == 0){
                        console.log("NÃO ACHOU - PODE IR ");
                    }else{
                        console.log("ACHOU VOLTA");
                        /////////////////////////////////
                        jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/3"  , function(data){
                            // get_cardapio geral
                            jquery.get("https://chatbot-whatsapp-br.com.br/app/get_cardapio/"+message.selectedId+"/"+id_cliente  , function(data_list){
                                if(data_list == "0"){
                                    client.sendText(message.from,"Nenhum evento encontrado");
                                    return false;
                                }
                                
                                
                                
                                const obj = JSON.parse(data_list);
                                //console.log(obj);
                                var oo = [{title : "Cardápio "+tit}];
                                var arr_rows = [];
                                // $##############  LISTA
                                for(var h=0; h<obj.length; h++){
                                    console.log(obj);
                                    console.log("ARRAY json: "+obj.length)
                                    if(h <= obj.length){
                                        //arr_rows[h] = {title:  obj[h].nome, description: obj[h].descricao  ,rowId: obj[h].id}
                                        arr_rows[h] = {title:  obj[h].modelo, description: "💵 R$ "+obj[h].preco_venda,  rowId: h};
                                    }
                                    
                                }
                                oo[0]['rows'] = arr_rows;
                                console.log(oo);
                                
                                let response2 = client.sendList(
                                    message.from,
                                    "Cardápio "+tit,
                                    oo,
                                    "Após selecionar o produto, você irá informar a quantidade",
                                    "Digite *menu* para ver o cardápio novamente.",
                                    "Clique abaixo para visualizar as nossas opções",
                                    message.id
                                );


                            

                            }) // x get list
                        })
                        /////////////////////////////////
                        return false;
                    } // x else
                




                       // jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/8"  , function(data){
                            //console.log(data);
                            jquery.post("https://chatbot-whatsapp-br.com.br/whats/get_produto_by_nome/"+message.from , {'whats' : message.from , 'q' : message.title , 'id_cliente' : id_cliente}   , function(data_pro){
                                    //console.log(data_insert);
                                    const dd_obj = JSON.parse(data_pro);
                                    //var id_pro_item = dd_obj.id_produto;
                                    var id_pro_item = dd_obj.id;
                                    console.log(" -------------------- "+id_pro_item);

                                    // get dados produto
                                    jquery.get("https://chatbot-whatsapp-br.com.br/whats/get_produto/"+id_pro_item , function(dd_pro){
                                            console.log(dd_pro);
                                            const pro_obj = JSON.parse(dd_pro);
                                            console.log(pro_obj);
                                            if(pro_obj.img_portfolio != "null"){
                                                client.sendImage(message.from, "https://chatbot-whatsapp-br.com.br/imagens/produtos/"+pro_obj.img_portfolio)
                                                    .then((result) => {

                                                        if(pro_obj.especificacoes != "" && pro_obj.especificacoes != "null"){

                                                            client.sendText(message.from, pro_obj.especificacoes)
                                                            .then((result) => {
                                                                const buttonsADD = [
                                                                    {buttonId: "id"+pro_obj.id, buttonText: {displayText: 'Adicionar 1'}, type: 1},
                                                                    {buttonId: "id"+pro_obj.id, buttonText: {displayText: 'Adicionar mais de 1'}, type: 2}
                                                                ]
                                                             client.sendButtons(message.from, "Deseja adicionar esse item?", buttonsADD, "")
                                                             .then((result) => {
                                                                  console.log(result.title);                                                                        
                                                                    /*
                                                                    client.sendText(message.from, '💁‍♂️- OK! *Digite a QUANTIDADE* de *'+message.title+'* que você deseja:\n\n _Para cancelar digite *0*_')
                                                                    .then((result) => {
                                                                        console.log(result);     
                                                                    });
                                                                    */
                                                                });
                                                            });

                                                        // })
                                                        }else{
                                                            const buttonsADD = [
                                                                {buttonId: "id"+pro_obj.id, buttonText: {displayText: 'Adicionar 1'}, type: 1},
                                                                {buttonId: "id"+pro_obj.id, buttonText: {displayText: 'Adicionar mais de 1'}, type: 2}
                                                            ]
                                                            client.sendButtons(message.from, "Deseja adicionar esse item?", buttonsADD, "")
                                                            .then((result) => {
                                                                console.log(result.title);                                                                        
                                                                    /*
                                                                    client.sendText(message.from, '💁‍♂️- OK! *Digite a QUANTIDADE* de *'+message.title+'* que você deseja:\n\n _Para cancelar digite *0*_')
                                                                    .then((result) => {
                                                                        console.log(result);     
                                                                    });
                                                                    */
                                                                });
                                                        /*
                                                            const buttonsCancI = [
                                                                {buttonId: "id5", buttonText: {displayText: 'Cancelar item'}, type: 1}
                                                            ]
                                                            //client.sendButtons(message.from, "Clique abaixo para cancelar 1772", buttonsCancI, "")
                                                        //  .then((result) => {
                                                                client.sendText(message.from, '💁‍♂️- OK! *Digite a QUANTIDADE* de *'+message.title+'* que você deseja:\n\n _Para cancelar digite *0*_')
                                                                .then((result) => {
                                                                    console.log(result);     
                                                                });                                                               
                                                        //   });
                                                        */
                                                        }

                                                    });
                                            }else{
                                                console.log("FOOOI 8  ---  "+data);
                                                /*
                                                client.sendText(message.from, '💁‍♂️- OK! *Digite a QUANTIDADE* de *'+message.title+'* que você deseja:\n\n _Para cancelar digite *0*_')
                                                .then((result) => {
                                                    console.log(result);     
                                                });
                                                */

                                                const buttonsADD = [
                                                        {buttonId: "id"+pro_obj.id, buttonText: {displayText: 'Adicionar 1'}, type: 1},
                                                        {buttonId: "id"+pro_obj.id, buttonText: {displayText: 'Adicionar mais de 1'}, type: 2}
                                                    ]
                                                client.sendButtons(message.from, "Deseja adicionar esse item?", buttonsADD, "")
                                                .then((result) => {
                                                    console.log(result.title);                                                                        
                                                        /*
                                                        client.sendText(message.from, '💁‍♂️- OK! *Digite a QUANTIDADE* de *'+message.title+'* que você deseja:\n\n _Para cancelar digite *0*_')
                                                        .then((result) => {
                                                            console.log(result);     
                                                        });
                                                        */
                                                    });

                                                

                                            } // x else id img
                                            //return false;
                                        });

                                });
                           });

                       // })
                

            }

            // #################  REPOSTAS DOS BOTOES  ############################
            //if (message.type == "buttons-response" || message.subtype == 'buttons-response' ) {
            if (message.type == "buttons-reply" || message.subtype == 'buttons-reply' ) {

                // ADD ITEM
                if(message.selectDisplay == "Adicionar item" || message.selectDisplay == "Adicionar 1"){
                    var id_display = message.selectedId;
                    id_display = id_display.replace("id","");
                    console.log("id_display: "+id_display);
                    jquery.post("https://chatbot-whatsapp-br.com.br/whats/add_car/"+message.from+"/"+id_cliente+"/"+id_display , {'whats' : message.from , 'nm_produto' : message.title , 'id_cliente' : id_cliente ,'qtd' : 1}   , function(data_insert){
                        client.sendText(message.from,"total");
                    })

                }

                if(message.selectDisplay == "Adicionar mais de 1"){
                    var id_display = message.selectedId;
                    id_display = id_display.replace("id","");
                    console.log("id_display: "+id_display);

                    jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/8"  , function(data){
                        console.log(data);
                        // jquery.post("https://chatbot-whatsapp-br.com.br/whats/add_car/"+message.from , {'whats' : message.from , 'nm_produto' : message.title , 'id_cliente' : id_cliente}   , function(data_insert){
                        jquery.post("https://chatbot-whatsapp-br.com.br/whats/add_car/"+message.from+"/"+id_cliente+"/"+id_display , {'whats' : message.from , 'nm_produto' : message.title , 'id_cliente' : id_cliente}   , function(data_insert){

                            client.sendText(message.from, '💁‍♂️- OK! *Digite a QUANTIDADE* que você deseja:\n\n _Para cancelar digite *0*_')
                            .then((result) => {
                                console.log(result);     
                            });

                        })
                    })

                }

                // Cancelar item
                if(message.selectDisplay == "Cancelar item" || message.selectDisplay == "Não, quero cancelar"){
                    jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/3"  , function(data){
                        client.sendText(message.from,"Item removido com sucesso! Digite *Menu* para visualizar o cardápio novamente")
                        .then((result) =>{
                            //client.sendText(message.from,"Menu");
                        })
                        
                    })

                }

                // repostas dinamicas por id
                if( (data_call > 55 && data_call <= 59 ) && (data_call != 22) ){

                    var dd_nivel = message.selectedId;
                    var nivel_n = dd_nivel.replace("id","");
                    nivel_n = parseInt(nivel_n);

                    jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/"+nivel_n  , function(data){

                        if(nivel_n == 56){
                            console.log("Digite o número do seu endereço");
                            client.sendText(message.from, "Digite o *número do seu endereço*. \n\n(Apenas números. Ex: _*56*_)");
                        }

                        if(nivel_n == 57){
                            console.log("Digite complementos");
                            client.sendText(message.from, "Digite um *complemento* ou *ponto de referência* . \n\n_Apt 102, Portão de madeira, casa de esquina..._");
                        }

                        // FORMA DE PAGAMENTO
                        if(nivel_n == 58){
                            console.log("Digitou seu complmento");
                            client.sendText(message.from, "OK! Obrigado por enviar as informações necessárias. ");

                            
                            const sections2 = [{title: 'Forma de pagamento',rows:[{ title: 'Dinheiro', rowId: '' },{ title: 'PIX', rowId: '' },{ title: 'Cartão débito/crédito', rowId: '' },{ title: 'Link de pagamento', rowId: '' },],},];

                                let response =  client.sendList(
                                    message.from,
                                    "Forma de pagamento",
                                    sections2,
                                    "Selecione a forma de pagamento",
                                    "Dinheiro, PIX, Cartão...",
                                    "selecione abaixo"
                                );

                                console.log(response);

                        }

                        /*
                        if(nivel_n == 58){
                            console.log("Digitou seu complmento");
                            client.sendText(message.from, "OK! Obrigado por enviar as informações necessárias. ");

                            
                            const sections2 = [{title: 'Forma de pagamento',rows:[{ title: 'Dinheiro', rowId: '' },{ title: 'PIX', rowId: '' },{ title: 'Cartão débito/crédito', rowId: '' },{ title: 'Link de pagamento', rowId: '' },],},];
                    
           
    
    
                                let response =  client.sendList(
                                    message.from,
                                    "Forma de pagamento",
                                    sections2,
                                    "Selecione a forma de pagamento",
                                    "Dinheiro, PIX, Cartão...",
                                    "selecione abaixo"
                                );
    
                                console.log(response);

                        }
                        */

                    })

                }

                // selectedId
                if(message.selectDisplay == "Remover"){
                        console.log("Removido "+message.selectedId);
                        var id_rem_pedido = message.selectedId.replace("p","");
                        console.log("Removido  trtado "+id_rem_pedido);
                        
                        // remover_pedido
                        jquery.get("https://chatbot-whatsapp-br.com.br/whats/remover_pedido/"+message.from+"/"+id_rem_pedido+"/"+id_cliente  , function(data){    
                            
                            client.sendText(message.from,"Item removido com sucesso.")
                            .then((result) => {

                                jquery.get("https://chatbot-whatsapp-br.com.br/whats/add_conf_car/"+message.from+"/"+id_cliente ,  function(subtotal){
                                                const buttonsF = [
                                                    {buttonId: "id10", buttonText: {displayText: 'Finalizar pedido'}, type: 1},                                        
                                                    {buttonId: "id11", buttonText: {displayText: 'Remover item'}, type: 2} // Remover item
                                                ];                                                    
                                                client.sendButtons(message.from, subtotal, buttonsF, 'Digite deletar para remover algum item ou menu para mostrar o cardápio novamente:')
                                                .then((result) => {

                                                        jquery.get("https://chatbot-whatsapp-br.com.br/app/get_cats/"+id_cliente  , function(data_list){
                                                        console.log(data_list);

                                                        const obj = JSON.parse(data_list);
                                                        //console.log(obj);
                                                        var buttonsC = [];
                                                        var o = [];
                                                        var c = 0;

                                                        // $##############  LISTA

                                                        var oo = [{title : "Cardápio"}];
                                                        var arr_rows = [];
                                                        // $##############  LISTA
                                                        for(var h=0; h<obj.length; h++){
                                                            console.log(obj);
                                                            console.log("ARRAY json: "+obj.length)
                                                            if(h <= obj.length){
                                                                //arr_rows[h] = {title:  obj[h].nome, description: obj[h].descricao  ,rowId: obj[h].id}
                                                                arr_rows[h] = {title:  obj[h].nome,  rowId: obj[h].id};
                                                            }
                                                            
                                                        }
                                                        oo[0]['rows'] = arr_rows;
                                                        console.log(oo);
                                                        
                                                        let response2 = client.sendList(
                                                            message.from,
                                                            "Cardápio",
                                                            oo,
                                                            "Após selecionar o produto, você irá informar a quantidade",
                                                            "Digite *menu* para ver o cardápio novamente.",
                                                            "Clique abaixo para visualizar as nossas opções",
                                                            message.id
                                                        );
                                                    })

                                                })
                                });

                                
                            });
                    }) // x get conf_car
                } // xc if remover


                if(message.selectDisplay == "Sim! Confirmo esse endereço"){
                    // jquery.post("https://rcatel.com/zap/set_nivel_user" , { 'whats' : message.from , 'nivel' : 3 } , function(data){
                            jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/56"  , function(data){    
                            client.sendText(message.from,"OK! Por favor digite o *NÚMERO* do seu endereço.");

                            });
                }

                // selectedId
                if(message.selectedId > 0 && message.selectedId < 999 ){

                    // get_cardapio geral
                    jquery.get("https://chatbot-whatsapp-br.com.br/app/get_cardapio/"+message.selectedId+"/"+id_cliente  , function(data_list){
                        var tit = "--";
                  
                        tit = message.selectDisplay;
                        const obj = JSON.parse(data_list);

                        var oo = [{title : "Cardápio "+tit}];
                        var arr_rows = [];
                        // $##############  LISTA
                        for(var h=0; h<obj.length; h++){
                            console.log(obj);
                            console.log("ARRAY json: "+obj.length)
                            if(h <= obj.length){
                                //arr_rows[h] = {title:  obj[h].nome, description: obj[h].descricao  ,rowId: obj[h].id}
                                arr_rows[h] = {title:  obj[h].modelo, description: "💵 R$ "+obj[h].preco_venda+" \n🗒️ "+obj[h].especificacoes,  rowId: h}
                            }
                            
                        }
                        oo[0]['rows'] = arr_rows;
                        console.log(oo);
                        
                        let response2 = client.sendList(
                            message.from,
                            "Cardápio "+tit,
                            oo,
                            "Após selecionar o produto, você irá informar a quantidade",
                            "Digite *menu* para ver o cardápio novamente.",
                            "Clique abaixo para visualizar as nossas opções",
                            message.id
                        );
                    

                    }) // x get list

                } // x if selectId

                if(message.selectDisplay == "Finalizar pedido"){
                    jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/10"  , function(data){
                        console.log("PEDE O CEP");

                        jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/55"  , function(data){
                            // Confirmado consulta marcada, para que possamos te enviar as melhores opções de atendimento, me informe seu CEP (somente números, sem traços, pontos e vírgulas) ou nos envie sua localização atual.
                            // 👷- OK! Me informa o CEP onde será realizado o serviço (somente números, sem traços, pontos e vírgulas)
                            client.sendText(message.from, 'OK! Precisamos saber o endereço da entrega.\nEscolha uma das opções abaixo: \n\n📍 - *Informe seu CEP* (somente números, sem traços, pontos e vírgulas) \n\n📍 - Envie *sua localização atual*.')
                                .then((result) => {

                                    //jquery.post("https://rcatel.com/zap/set_nivel_user" , { 'whats' : message.from , 'nivel' : 2 } , function(data){})
                                    jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/55"  , function(data){  
                                        console.log("VOLTOU PRO NIVEL 55")
                                    })

                                });

                                return false;
                        })
                        
                        /*client.sendText(message.from, "OK! Me informa por favor a forma de pagamento de sua preferência")
                        .then((result) => {
                            console.log("Finalizar pedido");
                        })
                        */

                    })
                }


                if(message.selectDisplay == "Adicionar informação sobre o pedido" && message.isgroup == false){
                    console.log("informar OBS --------------------- ");
                    jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/109"  , function(data){
                        client.sendText(message.from,"Digite alguma observação sobre o pedido.\n\nEx: sem cebola , apenas algum ingrediente...")
                        .then((result) =>{
                            console.log("informar OBS");
                        })
                    })

                }

                if(message.selectDisplay == "OK! Tudo certo." && message.isgroup == false){

                    jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/2"  , function(data){
                                console.log("Confirma PRODUTO");

                                jquery.get("https://chatbot-whatsapp-br.com.br/whats/add_conf_car/"+message.from+"/"+id_user ,  function(subtotal){

                                    const buttonsF = [
                                        {buttonId: "id10", buttonText: {displayText: 'Finalizar pedido'}, type: 1},
                                        {buttonId: "id10", buttonText: {displayText: 'Remover item'}, type: 2} // Remover item
                            
                                    ];
                                    
                                    client.sendButtons(message.from, subtotal, buttonsF, 'Digite deletar para remover algum item ou menu para mostrar o cardápio novamente:')
                                    .then((result) => {
                                        console.log(result.title);                                
                                        ///////////////////////////////
                                        // get_cardapio categorias
                                        jquery.get("https://chatbot-whatsapp-br.com.br/app/get_cats/"+id_cliente  , function(data_list){
                                            console.log(data_list);

                                            jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/1"  , function(data){
                                                            
                                                                //return false;
                                            

                                            const obj = JSON.parse(data_list);
                                            //console.log(obj);
                                            var oo = [{title : "Cardápio Geral"}];
                                            var arr_rows = [];
                                                // $##############  LISTA
                                                for(var h=0; h<obj.length; h++){
                                                    console.log(obj);
                                                    console.log("ARRAY json: "+obj.length)
                                                    if(h <= obj.length){
                                                        arr_rows[h] = {title:  obj[h].nome, description: obj[h].descricao  ,rowId: obj[h].id}
                                                    }
                                                    
                                                }
                                                oo[0]['rows'] = arr_rows;
                                                console.log(oo);
                                                
                                                let response2 = client.sendList(
                                                    event.to,
                                                    "Cardápio Geral",
                                                    oo,
                                                    "Após selecionar o produto, você irá informar a quantidade",
                                                    "Digite *menu* para ver o cardápio novamente.",
                                                    "Clique abaixo para visualizar as nossas opções",
                                                    event.id
                                                );


                                        }) // x get list

                                        });
                                        ///////////////////////////////                                
                                    });
                                

                                console.log(subtotal);
                            
                                })

                            })

                }
                
                var verifica_str = message.selectDisplay;
                if(message.selectDisplay == "Sim, confirmo" && message.isgroup == false){


                        // VERIFICA ADICIONAL
                    console.log("SIM CONFIRMOU");
                    // CASO SEJA MARMITEX
                    jquery.post("https://chatbot-whatsapp-br.com.br/whats/ver_last_car/"+message.from+"/"+id_cliente , {'whats' : message.from }   , function(data_last_car){

                        jquery.post("https://chatbot-whatsapp-br.com.br/whats/ver_last_car/"+message.from+"/"+id_cliente+"/produto" , {'whats' : message.from }   , function(data_last_produto_car){
                            // data_last_produto_car  
                            console.log("Categoria escolhid: "+data_last_car);
                            console.log("Produto escolhido: "+data_last_produto_car);
                            if(data_last_car != "0" && data_last_car != 0){

                                ////////////////////////////////////////////////////////////////////////////////////////////
                                jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/101"  , function(data){
                                    // get_cardapio geral
                                    jquery.get("https://chatbot-whatsapp-br.com.br/app/get_cardapio/"+data_last_car+"/"+id_cliente+"/1"  , function(data_list){ // GET APENAS ADIVIONAIS
                                        var tit = "--";
                                        tit = message.title;
                                        const obj = JSON.parse(data_list);
                                        //console.log(obj);
                                        var buttons = {};
                                        var o = [];
                                        var c = 0;
                                        //var cont = obj.length + 1;
                                        //o[0] = { title: "Exames" , rows: []};
                                        
                                        for(var h=0; h<obj.length; h++){
                                            console.log(obj);
                                            c = h+1;
                                            var id_bug = h+100;
                                            //o[h] = { index: c,  quickReplyButton: {displayText: obj[h].texto}};
                                            //o[h] = { title: obj[h].id,  rows: [{title:  obj[h].modelo+" - R$ "+obj[h].preco_venda ,  rowId: h} ]};
                                            o[h] = { title: "-", rows: [{title:  obj[h].modelo, description: "Adicional",  rowId: h} ]};
                                            //o[h] = {  rows: [{title: obj[h].nome ,  rowId: h} ]};
                                            //[ {title: 'Clínica/Profissionais',rows:[{ title: '208 - R$ 100,00 - Ana - Boa Viagem', rowId: '208' },{ title: '209 - R$ 100,00 - Luiza - Engenho Novo', rowId: '209' },{ title: '210 - R$ 100,00 - Solange - Espinheiro', rowId: '210' },],},];


                                            //}
                                        }
                                        console.log(o);

                                        let response = client.sendList(
                                            message.from,
                                            "Adicionais",
                                            o,
                                            "Adicional",
                                            "Selecione algum adicional para seu pedido.",
                                            "Clique abaixo para visualizar as opções"
                                        )
                                        .then((result) => {
                                            const buttonsadicional = [
                                                {buttonId: "id5", buttonText: {displayText: 'Não, obrigado'}, type: 1},
                                                {buttonId: "id6", buttonText: {displayText: 'Adicionar informação sobre o pedido'}, type: 1},
                                                {buttonId: "id7", buttonText: {displayText: 'Ver Total'}, type: 1}
                                            ]
                                            client.sendButtons(message.from, "Deseja algum adicional?", buttonsadicional, "")
                                            .then((result) => {



                                            })
                                        })


                                    

                                    }) // x get list
                                })
                                ////////////////////////////////////////////////////////////////////////////////////////////

                            }else{

                                //////////////////////////////////////////////////////////////////////////////////////////////
                                // CONTINUA NORMAL
                                jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/2"  , function(data){
                                    console.log("Confirma PRODUTO");

                                    jquery.get("https://chatbot-whatsapp-br.com.br/whats/add_conf_car/"+message.from+"/"+id_user ,  function(subtotal){

                                        const buttonsF = [
                                            {buttonId: "id1", buttonText: {displayText: 'OK! Tudo certo.'}, type: 1},
                                            {buttonId: "id109", buttonText: {displayText: 'Adicionar informação sobre o pedido'}, type: 2}, // Remover item
                                            {buttonId: "id9", buttonText: {displayText: 'Remover item'}, type: 2} // Remover item
                                            
                                            
                                
                                        ];
                                        
                                        client.sendButtons(message.from, "Deseja informar alguma observação sobre o pedido?", buttonsF, 'Digite deletar para remover algum item ou menu para mostrar o cardápio novamente:')
                                        .then((result) => {
                    
                                            
                                    
                                        });
                                    

                                    console.log(subtotal);
                                
                                    })

                                })
                                //console.log(data_conf); // tratar esse json para mostrar em texto
                                /////////////////////////////////////////////////////////////////////////////////////////////

                            } // x else != 0

                        })
                    })

                    return false;

                    



                        ///////////////////////////////////////  CODIGO ANTIGO
                        
                        // CONTINUA NORMAL
                        jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/2"  , function(data){
                                    console.log("Confirma PRODUTO");
                                    // PARCIAL E BOTOES
                                    jquery.get("https://chatbot-whatsapp-br.com.br/whats/add_conf_car/"+message.from+"/"+id_user ,  function(subtotal){

                                        const buttonsF = [
                                            {buttonId: "id10", buttonText: {displayText: 'Finalizar pedido'}, type: 1},
                                            {buttonId: "id10", buttonText: {displayText: 'Remover item'}, type: 2} // Remover item
                                
                                        ];
                                        
                                        client.sendButtons(message.from, subtotal, buttonsF, 'Digite deletar para remover algum item ou menu para mostrar o cardápio novamente:')
                                        .then((result) => {
                    
                                            //console.log(result.title+" +++ ++ + ++ ");
                                            console.log(result.title);
                                        /*});

                                        client.sendText(message.from, subtotal)
                                        .then((result) => {*/

                                        
                                            ///////////////////////////////
                                            // get_cardapio categorias
                                            jquery.get("https://chatbot-whatsapp-br.com.br/app/get_cats/"+id_cliente  , function(data_list){
                                                console.log(data_list);

                                                jquery.get("https://chatbot-whatsapp-br.com.br/whats/set_nivel_user/"+message.from+"/1"  , function(data){
                                                                
                                                                    //return false;
                                                

                                                const obj = JSON.parse(data_list);
                                                //console.log(obj);
                                                var buttonsC = [];
                                                var o = [];
                                                var c = 0;
                        
                                                /*
                                                for(var h=0; h<obj.length; h++){
                                                    console.log(obj);
                                                    c = h+1;
                                                    var add =  {buttonId: obj[h].id, buttonText: {displayText: obj[h].nome}, type: 1};
                                                    buttonsC.push(add);
                                                } // x for

                                                client.sendButtons(message.from, "Adicionar mais itens no carrinho?", buttonsC, 'Acrescente mais produtos ao seu pedido:')
                                                .then((result) => {
                            
                                                    //console.log(result.title+" +++ ++ + ++ ");
                                                    console.log(result);
                                                });
                                                console.log(buttonsC);                   
                                                */
                                                // $##############  LISTA
                                                for(var h=0; h<obj.length; h++){
                                                    console.log(obj);
                                                    c = h+1;
                                                    //o[h] = { index: c,  quickReplyButton: {displayText: obj[h].texto}};
                                                    //o[h] = { title: obj[h].id,  rows: [{title:  obj[h].nome,  rowId: obj[h].id} ]};
                                                    o[h] = { title: "⬇️",  rows: [{title:  obj[h].nome,  rowId: obj[h].id} ]};
                                                    //o[h] = {  rows: [{title: obj[h].nome ,  rowId: h} ]};
                                                    //[ {title: 'Clínica/Profissionais',rows:[{ title: '208 - R$ 100,00 - Ana - Boa Viagem', rowId: '208' },{ title: '209 - R$ 100,00 - Luiza - Engenho Novo', rowId: '209' },{ title: '210 - R$ 100,00 - Solange - Espinheiro', rowId: '210' },],},];


                                                    //}
                                                }
                                                console.log(o);

                                                let response = client.sendList(
                                                    message.from,
                                                    "Cardápio Geral",
                                                    o,
                                                    "Após selecionar o produto, você irá informar a quantidade",
                                                    "Digite *menu* para ver o cardápio novamente.",
                                                    "Clique abaixo para visualizar as nossas opções"
                                                );

                                            }) // x get list

                                            });

                                            ///////////////////////////////
                                            
                                            /*
                                            const menu2 = [{title: 'Castanha',rows:[{ title: 'Castanha Com Sal', rowId: '1' },{ title: 'Castanha Sem Sal', rowId: '1' },{ title: 'Castanha Brejeira', rowId: '1' },{ title: 'Castanha Mix Passas', rowId: '1' },{ title: 'Castanha Com Sal', rowId: '1' },{ title: 'Castanha Sem Sal', rowId: '1' },{ title: 'Castanha Brejeira', rowId: '1' },{ title: 'Castanha Caramelizada', rowId: '1' },{ title: 'Castanha Mix Passas', rowId: '1' },{ title: 'Castanha Pará', rowId: '1' },{ title: 'Castanha Com Sal', rowId: '1' },{ title: 'Castanha Sem Sal ', rowId: '1' },{ title: 'Castanha Brejeira', rowId: '1' },{ title: 'Castanha Mix Passas', rowId: '1' },{ title: 'Matéria prima castanha brejeira', rowId: '1' },{ title: 'Matéria prima castanha banda crua', rowId: '1' },{ title: 'Creme de Alho Com Bacon', rowId: '1' },],},{title: 'Tempero',rows:[{ title: 'Açafrão da terra', rowId: '2' },{ title: 'Alecrim', rowId: '2' },{ title: 'Alho Frito', rowId: '2' },{ title: 'Baiano', rowId: '2' },{ title: 'Bicarbonato', rowId: '2' },{ title: 'Canela em Pó', rowId: '2' },{ title: 'Chimichurri com pimenta', rowId: '2' },{ title: 'Chimichurri sem pimenta', rowId: '2' },{ title: 'Curry', rowId: '2' },{ title: 'Ervas Finas', rowId: '2' },{ title: 'Gengibre moído ', rowId: '2' },{ title: 'Lemon peper', rowId: '2' },{ title: 'Mix Cebola s.a', rowId: '2' },{ title: 'Noz moscada', rowId: '2' },{ title: 'Orégano ', rowId: '2' },{ title: 'Páprica doce', rowId: '2' },{ title: 'Páprica picante', rowId: '2' },{ title: 'Pimenta calabresa', rowId: '2' },{ title: 'Pimenta preta', rowId: '2' },{ title: 'Sal rosa fino', rowId: '2' },],},{title: 'Amendoim',rows:[{ title: 'Dom Mix', rowId: '3' },{ title: 'Amendoin Japonês Cebola e Salsa', rowId: '3' },{ title: 'Amendoin Japonês Churrasco', rowId: '3' },{ title: 'Amendoin Japonês Pimenta', rowId: '3' },{ title: 'Amendoin Japonês Tradicional', rowId: '3' },{ title: 'Amendoin Torrado Com Casca', rowId: '3' },{ title: 'Amendoin Sem Pele Com Sal', rowId: '3' },{ title: 'Amendoin Sem Pele Sem Sal', rowId: '3' },{ title: 'Amendoin Sem Pele Com Sal', rowId: '3' },{ title: 'Amendoin Sem Pele Sem Sal', rowId: '3' },{ title: 'Amendoin Sem Pele CRU', rowId: '3' },{ title: 'Matéria prima amendoin com sal', rowId: '3' },{ title: 'Matéria prima amendoin sem sal', rowId: '3' },],},{title: 'Outros',rows:[{ title: 'Sal Himalaia ', rowId: '4' },{ title: 'Creme de Alho Tradicional ', rowId: '4' },{ title: 'Creme de Alho Com Queijo', rowId: '4' },{ title: 'Alho triturado', rowId: '4' },{ title: 'Alho triturado ', rowId: '4' },{ title: 'Alho triturado', rowId: '4' },],},];
            
                                            client.sendList(
                                                //let response = await const response = await client.sendList(
                                                message.from,
                                                "Escolha o produto",
                                                menu2,
                                                "Cardápio",
                                                "", //Description opcional
                                                "Clique no botão abaixo para ver o cardápio \n Para remover algum item digite *remover* \n Para voltar ao cardápio digite *menu*"
                                            );
                                            */
                                        });
                                    

                                    console.log(subtotal);
                                
                                    })
                        })
                        ///////////////////////////////////////////////////////////
                        //console.log(data_conf); // tratar esse json para mostrar em texto
                } 
                    
            } // x if botoes

            
         


    }); // x 1º POST

        
        

        

        





    } // xxxxxxxxxxxxxxxxxxx tudo

    })
//

    return client;

}

(async function(){
  let client = await start();
    //let response = await client.sendText('0000000000000', 'Thanks for using Superchats!!!')
    //console.log(response)

 


})(

)