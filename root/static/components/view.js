const view = {
    
    template:`
    <div class="col-md-7">
    <h1> The data for the tracker 
    <div id="tracker">{{$route.params.tracker}}</div></h1>

    <div>
  <canvas id="myChart"></canvas>
    </div>
    <table>
    <thead>
    
    <tr style=" border: 1px solid black;">
    <th style=" border: 1px solid black;">ID</th>
      <th style=" border: 1px solid black;">Type</th>
      <th style=" border: 1px solid black;">Value</th>
      <th style=" border: 1px solid black;">Note</th>
      <th style=" border: 1px solid black;">update</th>
      <th style=" border: 1px solid black;">Delete</th>
      </tr>
      </thead>
      <tbody>
      <tr style=" border: 1px solid black;" v-for= "t in values">
      <td style=" border: 1px solid black;">{{t.id}}</td>
      <td style=" border: 1px solid black;">{{$route.params.tracker}}</td>
      <td style=" border: 1px solid black;">{{t.Value}}</td>
      <td style=" border: 1px solid black;">{{t.Note}}</td>
      <td style=" border: 1px solid black;"><button type="button" class="btn btn-info"><router-link :to="'/update/'+ $route.params.tracker +'/'+ t.id">update</router-link></button></td>
      <td style=" border: 1px solid black;"><button @click="deleteval(t.id)" type="button" class="btn btn-danger">Delete</button></td>
      </tr>
      </tbody>
    </table>
    <button type="button" class="btn btn-warning"><router-link :to="'/value/'+ $route.params.tracker" >Log new value here</router-link></button>
    <div><button @click="tableToCSV2" type="button" class="btn btn-success">export as CSV</button></div>
    </div>
    `,
    data(){
        return {
            values:[],
            labels:[],
            datas:[],
        }
    },
    async created(){
        let val = this.$route.params.tracker
        console.log(val)
        const res3 = await fetch(`/api/trackers/${localStorage.getItem('user')}/${this.$route.params.tracker}`).then(res3=>res3.json()).then(data=>{this.values=data})

        console.log("values",this.values)
        for(let i in this.values){this.labels.push(this.values[i].id);if(Number.isInteger(parseInt(this.values[i].Value))){this.datas.push(this.values[i].Value)} else{this.datas.push(this.values[i].Value.length)}}
        
        var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
        labels:this.labels,
        datasets: [{
            label: "Tracker",
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: this.datas,
        }]
    },

    // Configuration options go here
    options: {}
});
    },
    methods:{
        async deleteval(id){
            console.log(id)
            let url = 'http://127.0.0.1:5000/api/value/'+id
            const res = await fetch(url,{method:'delete'})
            location.reload(true)
        },
        tableToCSV2() {
 
            // Variable to store the final csv data
            var csv_data = [];
         
            // Get each row data
            var rows = document.getElementsByTagName('tr');
            for (var i = 0; i < rows.length; i++) {
         
                // Get each column data
                var cols = rows[i].querySelectorAll('td,th');
         
                // Stores each csv row data
                var csvrow = [];
                for (var j = 0; j < cols.length-2; j++) {
         
                    // Get the text data of each cell of
                    // a row and push it to csvrow
                    csvrow.push(cols[j].innerHTML);
                }
         
                // Combine each column value with comma
                csv_data.push(csvrow.join(","));
            }
            // combine each row data with new line character
            csv_data = csv_data.join('\n');
         
            /* We will use this function later to download
            the data in a csv file downloadCSVFile(csv_data);
            */
            this.downloadCSVFile2(csv_data);

        },
     downloadCSVFile2(csv_data) {
          console.log(csv_data)
          // Create CSV file object and feed
          // our csv_data into it
          let CSVFile = new Blob([csv_data], {
            type: "text/csv"
        });
        console.log(CSVFile)
      

        // Create to temporary link to initiate
        // download process
        var temp_link = document.createElement('a');

        // Download csv file
        temp_link.download = "Value.csv";
        var url = window.URL.createObjectURL(CSVFile);
        temp_link.href = url;

        // This link should not be displayed
        temp_link.style.display = "none";
        document.body.appendChild(temp_link);

        // Automatically click the link to
        // trigger download
        temp_link.click();
        document.body.removeChild(temp_link);
        let value= {'text':'HI, your file is exported as csv'}
        fetch('https://chat.googleapis.com/v1/spaces/AAAA_C3YrS4/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=Wu2T8-KFfIUWE7Fyjr6tJqT4fCYmKQTmnZOPCoKiKfA%3D',{method:'POST',body:JSON.stringify(value)}).then(r => r.json()).then(d=> console.log(d)).catch(err=>console.log(err))
    }
    }
}

    

export default view