const profile = {
    template: `<div class="col-md-10">
      <div v-if="success">
      <h1> Username: {{profile.username}}</h1>
      <h2>Email: {{profile.email}}</h2>
      
      </div>
      <div v-else>
         {{error}}
      </div>
      <div><h3>You Have following trackers</h3></div>
      <div>
      <table id='tableToExcel' style=" border: 1px solid black;" >
      <thead>
      <tr style=" border: 1px solid black;">
      <th style=" border: 1px solid black;">Tracker_name</th>
      <th style=" border: 1px solid black;">Time_created</th>
      <th style=" border: 1px solid black;">Tracker_type</th>
      <th style=" border: 1px solid black;">Description</th>
      <th style=" border: 1px solid black;">View</th>
      <th style=" border: 1px solid black;">Delete</th>
      </tr>
      </thead>
      <tbody>
      <tr style=" border: 1px solid black;" v-for="t in trackers">
      <td id="trackername" style=" border: 1px solid black;">{{t.Tracker_name}}</td>
      <td style=" border: 1px solid black;">{{t.Time_created}}</td>
      <td style=" border: 1px solid black;">{{t.Tracker_type}}</td>
      <td style=" border: 1px solid black;">{{t.Tracker_description}}</td>
      <td style=" border: 1px solid black;"><button type="button" class="btn btn-light"><router-link :to="'/view/'+ t.Tracker_name">View history</router-link></button></td>
      <td style=" border: 1px solid black;"><button @click="deletetracker(t.T_id)" type="button" class="btn btn-danger">Delete</button></td>
      </tr>
      </tbody>
      </table>
      </div><br><br>
      
      <div> <button type="button" class="btn btn-info"><router-link to="/addtracker">Add Tracker here</router-link></button></div>
      <div><button @click="tableToCSV" type="button" class="btn btn-success">export as CSV</button></div>
    </div>`,
  
    data() {
      return {
        profile: {
          username: 'Abhisek',
          email: 'narendra@gmail.com',
        },
  
        success: true,
        error: 'Something went wrong',
        trackers:[]
      }
    },
  
    async mounted() {
      const res = await fetch(`/api/user/${localStorage.getItem('user')}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authentication-Token': localStorage.getItem('auth-token'),
          //   'WyI4MzI1YThmNjc3NzE0MTdlYWNiOTQ1YmI3OTg2OTExNCJd.YhTcgg.hu9X8B-RDH_v_FXNscFiuie-IoM',
        },
      })
      const data = await res.json()
      console.log(data)
      if (res.ok) {
        this.profile = data
      } else if (res.status == 401) {
        this.success = false
        this.error = data.response.error
      } else {
        this.success = false
        this.error = data.message
      }
      
    },
    async created(){
    const res2 = await fetch(`/api/trackers/${localStorage.getItem('user')}`).then(res2=>res2.json())
                  .then(data => {this.trackers = data})
      console.log(this.trackers)
    },
  methods:{
    async deletetracker(id){
      console.log(id)
            let url = 'http://127.0.0.1:5000/api/trackers/'+id
            const res = await fetch(url,{method:'delete'})
            location.reload(true)},
    tableToCSV() {
 
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
              this.downloadCSVFile(csv_data);
 
          },
       downloadCSVFile(csv_data) {
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
          temp_link.download = "Tracker.csv";
          var url = window.URL.createObjectURL(CSVFile);
          temp_link.href = url;

          // This link should not be displayed
          temp_link.style.display = "none";
          document.body.appendChild(temp_link);

          // Automatically click the link to
          // trigger download
          temp_link.click();
          document.body.removeChild(temp_link);
          fetch('https://chat.googleapis.com/v1/spaces/AAAA_C3YrS4/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=Wu2T8-KFfIUWE7Fyjr6tJqT4fCYmKQTmnZOPCoKiKfA%3D',{method:'POST',body:JSON.stringify(value)}).then(r => r.json()).then(d=> console.log(d)).catch(err=>console.log(err))
      }
      }
  }
  
  
  export default profile