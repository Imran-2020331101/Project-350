const express = require("express");
const app = express();
const Configuration= require("openai");
const OpenAIApi = require("openai")
app.use(express.json());

const config = new Configuration({
    apiKey:process.env.OPEN_AI_API_KEY,
});
const openai = new OpenAIApi(config);

const CreateBlog=async (descriptions) => {
  
    var result = [];
    descriptions.forEach(async (description) => {
        try{
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `${description[0]} this is a travles description of some photos he took during his trip to Paris. Generate a blog from this. Your response should be in this json form {title:"",blog:""}.`
                    },
                ],
                response_format: { type: "json_object"},
                model: "gpt-4o-mini",   
            });
            console.log(completion.choices[0].message.content)
            result.push(completion.choices[0].message.content);

        }catch(error){
           return res.send(error)
        }
    })    
    return result;  
       
};

