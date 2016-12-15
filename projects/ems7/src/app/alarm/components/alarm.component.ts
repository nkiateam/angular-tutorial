import { Component, OnInit } from '@angular/core';

import { Alarm } from '../models/alarm';

@Component({
    selector: 'alarm-list',
    template: `
        <h1>알람 목록</h1>
        <button (click)="onConnect()">#Connect</button>
        <button (click)="onDisconnect()">#Disconnect</button>
        <button (click)="onFireEvent()">Event 발생</button>
        <div>메시지 입력 :  <input [(ngModel)]="message" (keypress)="eventHandler($event)" placeholder="알람 메시지"/></div>
        <div id='alarm_list'></div>

    `,
    styles: [`

    `]
})

export class AlarmComponent implements OnInit {
    webSocket:WebSocket = null;
    message:string;

    constructor(){
   
    }

    eventHandler(event:any): void{
        if(event.code == "Enter"){
            this.onFireEvent();
        }
    }

    onConnect(): void {
        $.ajax({ 
            type:"POST", 
            url:'http://192.168.10.89:8090/itg/base/connection.do', 
            contentType: "application/json", 
            dataType: "json", 
            async: false,
            data: JSON.stringify({}),
            success:function(data){
                if(this.webSocket === null){
                    this.webSocket = new WebSocket("ws://192.168.10.89:8887");

                    console.info(this.webSocket);

                    //웹 소켓이 연결되었을 때 호출되는 이벤트
                    this.webSocket.onopen = (message:string) => {
                        console.info("Server connect...\n" + message);
                    }

                    //웹 소켓이 닫혔을 때 호출되는 이벤트
                    this.webSocket.onclose = (message:string) => {
                        console.info("Server Disconnect...\n" + message);
                    }  
                    
                    //웹 소켓이 에러가 났을 때 호출되는 이벤트
                    this.webSocket.onerror = (message:string) => {
                        console.info("error...\n" + message);
                    };
                    //웹 소켓에서 메시지가 날라왔을 때 호출되는 이벤트
                    this.webSocket.onmessage = (message:any) => {
                        //console.info(message);
                        console.info("Recieve From Server => "+message.data);
                        
                        try{
                            var data = JSON.parse(message.data);
                            var grid = $("#alarm_list").data("kendoGrid");
                            grid.dataSource.insert(0, data);
                            grid.dataSource.sync();
                        }catch(e){

                        }
                    };
                }
            }
        });

       
        
    }

    onDisconnect(): void {
        console.info("disconnected");
        //console.info(this.webSocket);
        this.webSocket.close();
    }

    onFireEvent(): void {
        console.info("onFireEvent");
        var params = {
            message: this.message
        }
        $.ajax({ 
            type:"POST", 
            url:'http://192.168.10.89:8090/itg/base/fireEvent.do', 
            contentType: "application/json", 
            dataType: "json", 
            data: JSON.stringify(params),
            success:function(data){
                //console.info(data);
            }
        });
    }

    // ng init
    ngOnInit() {
        $("#alarm_list").kendoGrid({
            dataSource: { 
                transport: {
                    read: {
                        url: "http://192.168.232.116:8080/rest/alarm/1021",
                        type: "POST",
                        dataType: 'jsonp',
                        data: null,      // search (@RequestBody GridParam gridParam 로 받는다.)
                        contentType: 'application/json; charset=utf-8'
                    }
                },
                schema: {
                    data(response) {
                        return response.configuration;
                    },
                    total(response: JSON) {
                        
                    }
                },
                pageSize: 100
            },
            groupable: true,
            sortable: true,
            resizable: true,
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            columns: [{
                field: "severity",
                title: "심각도",
                width: 120
            }, {
                field: "hostType",
                title: "알람 이름",
                width: 150
            }, {
                field: "cTime",
                title: "발생 시간",
                width: 150
            }, {
                field: "ancestry",
                title: "대상"
            }, {
                field: "conditionLog",
                title: "컨디션 로그",
                width: 600
            }]
        });

        var grid = $("#alarm_list").data("kendoGrid");
		grid.bind("dataBound", grid_dataBound);

		function grid_dataBound(e:any) {
			var items = e.sender.items();
			items.each(function (index: any) {
				var dataItem = grid.dataItem(this);
				if (dataItem["severity"] === "CRITICAL") {
					this.className += " critical";
				}
				else {
					this.className += " clear";
				}
			})
		}
    }
}