const value={
    template: `
    <div class="col-md-7">
    <h1> Log your values here!!</h1>
    <form>
    <div v-if="settings != '' ">
    <label for="Tracker_type"> Choose your tracker type: </label>
    
        <select id = "Tracker_type" name = "Tracker_type" v-model="values.Value"  >
        
            <option  v-for="t in settings"  :value = t > {{t}} </option>
     
            
        </select><br><br>
        
    </div>
    <div v-else>
    <input type='text' name="Value" id="Value" placeholder="Value" v-model="values.Value" required /><br><br>
    </div>
    <input type='text' name='Note' id='Note' placeholder='Note' v-model="values.Note" required /><br><br>
  
    <button @click.prevent="addValue"> Click Here to add a value </button>
    </form>
    </div>
    `,
    data(){
        return {
            values:{
                Value:"",
                Note:""

            },
            lists:[],
            settings:''
        }
    },
    async created(){
    const res2 = await fetch(`/api/trackers/${localStorage.getItem('user')}`).then(res2=>res2.json())
                  .then(data => {this.lists = data}).then()
      console.log("lists:",this.lists)
      for (let i in this.lists){
        if(this.lists[i].Tracker_name == this.$route.params.tracker){this.settings =this.lists[i].settings.split(",") }
      }
      for (let i in this.settings){console.log(this.settings[i])}
      
    },
    methods:{
           async addValue(){
               if(this.values.Value ==""){
               alert("add a value")
            }
            if(this.values.Value !=""){
            const res = await fetch(`/api/trackers/${localStorage.getItem('user')}/${this.$route.params.tracker}`, {
                method: 'post',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.values),
              })
    
            
              if (res.ok) {
                const data = await res.json()
                
                console.log(data)
                this.$router.push(`/view/${this.$route.params.tracker}`)
              } else {
                console.log('something went wrong')
              }
        }}
    }
}
export default value