const update={
    template:  `
    <div class="col-md-7">
    <h1>Update value here</h1>
    <form>
    
    <div v-if="setting != '' ">
    <label for="Tracker_type"> Choose your tracker type: </label>
    
        <select id = "Tracker_type" name = "Tracker_type" v-model="updated_val.Value"  >
        
            <option  v-for="t in setting"  :value = t > {{t}} </option>
     
            
        </select><br><br>
        
    </div>
    <div v-else>
    <input type='text' name="Value" id="Value" placeholder="Value" v-model="updated_val.Value" required /><br><br>
    </div>
    <input type="text" name="note" id="note"  placeholder="note" v-model="updated_val.Note" /><br><br>
    <button @click.prevent="updateval" type="button" class="btn btn-warning"> Upadate </button>
    </form>
    </div>`,

    data(){
        return{
        updated_val:{
            Value:"",
            Note:""
        },
        setting:''
    }
    },
    async created(){
      const res2 = await fetch(`/api/trackers/${localStorage.getItem('user')}`).then(res2=>res2.json())
                    .then(data => {this.lists = data}).then()
        console.log("lists:",this.lists)
        for (let i in this.lists){
          if(this.lists[i].Tracker_name == this.$route.params.tracker){this.setting =this.lists[i].settings.split(",") }
        }
        for (let i in this.setting){console.log(this.setting[i])}
        
      },
    methods:{
        async updateval(){
          const res = await fetch(`/api/value/${this.$route.params.id}`, {
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.updated_val),
          })
          if (res.ok) {
            const data = await res.json()
            
            console.log(data)
            this.$router.push(`/view/${this.$route.params.tracker}`)
          }
        }
        }
    }


export default update