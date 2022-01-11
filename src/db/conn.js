const mongoose = require("mongoose");
 
mongoose.connect('mongodb://localhost:27017/Register2',
{  
   useNewUrlParser: true,  
   useUnifiedTopology: true
});

