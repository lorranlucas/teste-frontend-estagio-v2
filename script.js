

/*          Criação de Mapa            */

var map = L.map('map').setView([-19.163073, -46.06338], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);



/*          Arquivos JSON             */

$.getJSON('./data/equipment.json', function (E) {
    $.getJSON('./data/equipmentModel.json', function (EM) {
        $.getJSON('./data/equipmentPositionHistory.json', function (EPH) {
            $.getJSON('./data/equipmentState.json', function (ES) {
                $.getJSON('./data/equipmentStateHistory.json', function (ESH) {

                    DadosJSON_EPH = EPH;
                    DadosJSON_E = E;
                    DadosJSON_ES = ES;
                    DadosJSON_ESH = ESH;
                    DadosJSON_EM = EM;

                    for (var i = 0; i < DadosJSON_E.length; i++) {

                        var E_array = DadosJSON_E[i]
                        var E_ID = E_array.id
                        var E_ME = E_array.equipmentModelId
                        var E_Name = E_array.name
                        /*   console.log(E_ID)
                           console.log(E_ME)
                           console.log(E_Name)
                       */

                    }

                    for (var i = 0; i < DadosJSON_EM.length; i++) {

                        var EM_array = DadosJSON_EM[i]
                        var EM_name = EM_array.name
                        /* console.log(EM_name)  */


                    }

                    for (var i = 0; i < DadosJSON_EPH.length; i++) {

                        var EPH_array = DadosJSON_EPH[i];
                        var EPH_IdE = DadosJSON_EPH[i].equipmentId
                        var EPH_PArray = DadosJSON_EPH[i].positions


                        /*          Filtar Dados do EPH Por data mais recente             */

                        IdEquipamento_EPH = DadosJSON_EPH[i].equipmentId
                        Posição_EPH_IDV = DadosJSON_EPH[i].positions

                        console.log(EPH_IdE)
                        console.log(EPH_PArray)

                        EPH_PosiçãoAtual = EPH_PArray.reduce(function (r, a) {
                            return r.date > a.date ? r : a;
                        });

                        EPH_DataPosição = EPH_PosiçãoAtual.date;

                        var lon_EPH_recente = EPH_PosiçãoAtual.lon;
                        var lat_EPH_recente = EPH_PosiçãoAtual.lat;

                        console.log(EPH_PosiçãoAtual);


                        /*         Filtros           */



                        Filter_EPH_ESH = DadosJSON_ESH.filter(x => x.equipmentId == EPH_IdE);
                        console.log(Filter_EPH_ESH)
                        Filter_ESH_States = Filter_EPH_ESH[0].states

                        console.log("LOL!")

                        console.log(Filter_ESH_States[1].date)

                        ESH_PosiçãoAtual = Filter_ESH_States.reduce(function (r, a) {
                            return r.date > a.date ? r : a;
                        });

                        Filter_ESH_EuipmentStateID = ESH_PosiçãoAtual.equipmentStateId
                        console.log(Filter_ESH_EuipmentStateID)

                        Filter_E_EPH = DadosJSON_E.filter(x => x.id == EPH_IdE);
                        Filter_Name = Filter_E_EPH[0].name
                        Filter_EMId = Filter_E_EPH[0].equipmentModelId

                        Filter_E_EM = DadosJSON_EM.filter(x => x.id == Filter_EMId);
                        Filter_EM_name = Filter_E_EM[0].name
                        Filter_EM_hourlyEarnings = Filter_E_EM[0].hourlyEarnings

                        console.log('...Lol')
                        console.log(Filter_EM_name)
                        console.log(Filter_Name)
                        console.log(Filter_EMId)
                        console.log(Filter_EM_hourlyEarnings)

                        /*          EquipamentoState Cores           */
                        myVar = DadosJSON_ES.filter(x => x.id == Filter_ESH_EuipmentStateID);
                        dados_ES = myVar[0]
                        cor1 = dados_ES.color
                        Status = dados_ES.name
                        console.log(cor1)

                        /*          Criar Pontos no mapa            */
                        console.log([lat_EPH_recente, lon_EPH_recente])
                        marker = new L.circleMarker([lat_EPH_recente, lon_EPH_recente], {
                            radius: 8,
                            fillColor: cor1,
                            color: "#000",
                            weight: 3,
                            opacity: 1,
                            fillOpacity: 1
                        })

                            .bindPopup('<br>Equipamento :' + Filter_EM_name + '<br> Modelo :' + E_Name + '<br>Status :' + Status)
                            .addTo(map).on('click', onClick);
                    }
                }
                );
                function onClick(e) {
                    var array_hst = [];

                    for (var p = 0; p < Filter_ESH_States.length; p++) {
                        historico = Filter_ESH_States[p].date
                        historico2 = Filter_ESH_States[p].equipmentStateId
                        historico_status = DadosJSON_ES.filter(x => x.id == historico2);
                        console
                        historico_status_name = historico_status[0].name


                        array_hst.push({ Data: historico, Status: historico_status_name });
                    }
                    console.log(array_hst)

                    historico_final = JSON.stringify(array_hst)

                    var root = document.getElementById('root');
                    array_hst.forEach(element => root.insertAdjacentHTML('beforebegin', `<tr><td>${element.Data}</td><td>${element.Status}</td></tr>`));

                }
                map.on('popupopen', function (e) {
                    var marker = e.popup._source;

                });
            });

        });

    });

});