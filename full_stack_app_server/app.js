import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as cheerio from 'cheerio';
import axios from "axios";
// import connectdb from './config/connectdb.js';
// import userRoutes from './routes/userRoute.js';
dotenv.config(); //Note You will not be needed Dotenv package if you are using latest 20 version of Nodejs;

const app = express();
const port=process.env.Port;
// const DATABASE_URL = process.env.DATABASE_URL;

// For using Cors 
app.use(cors());
// connectdb(DATABASE_URL);
app.use(express.json());
// For connecting Database 

// Basic route 
app.get('/',(req,res)=>{
    res.status(200).send("Hellow there");

})
app.get('/ping',(req,res)=>{
    res.status(200).send("Hellow there you are on ping page");

})
app.get('/api/scrape', async (req, res) => {
    try {
    //    await axios.get("");
       const url = "https://www.aleaitsolutions.com/";  // Replace with actual URL to scrape
    const response = await axios.get(url);
    const html = response.data;
    // console.log(html,"html");
    const $ = cheerio.load(html);

    // const response = await axios.get(url);
    // const html = response.data;
    // const $ = cheerio.load(html);

    // Extracting details
    const name = $('title').text().trim(); // Extracting from <title> tag
    const description = $('meta[name="description"]').attr('content') || ''; // Meta description
    const companyLogo = $('img').first().attr('src'); // Example: Extracting first image src as logo
    const facebookURL = $('a[href*="facebook.com"]').attr('href') || '';
    const linkedinURL = $('a[href*="linkedin.com"]').attr('href') || '';
    const twitterURL = $('a[href*="twitter.com"]').attr('href') || '';
    const instagramURL = $('a[href*="instagram.com"]').attr('href') || '';
    // const address = $('[itemprop="address"]').text().trim() || '';
    // const phoneNumber = $('[itemprop="Call"]').text().trim() || '';
    // const email = $('a[href^="mailto:"]').attr('href')?.replace('mailto:', '') || '';
    let address = '';
    let phoneNumber = '';
    let email = '';

    // // Look for specific tags or attributes that may contain address, phone, or email
    $('p').each((index, element) => {
        const text = $(element).text().toLowerCase();

        // Find address-like content (which often contains numbers, commas, and street names)
        if (text.includes('address') || text.match(/\d{3,}/)) {
            address += $(element).text().trim() + ' ';
        }

        // Find phone number by detecting patterns like "Phone" or matching number patterns
        if (text.includes('phone') || text.match(/\+?\d[\d\s()-]{7,}/)) {
            phoneNumber = $(element).text().replace('Phone:', '').trim();
        }

        // Find email using a common email format
        if (text.includes('mail') || $(element).html().includes('mailto')) {
            email = $(element).find('a[href^="mailto:"]').attr('href')?.replace('mailto:', '').trim() || $(element).text().replace('Mail:', '').trim();
        }
    });
   
    // // Output the extracted details
    // console.log('Name:', name);
    // console.log('Description:', description);
    // console.log('Company Logo:', companyLogo);
    // console.log('Facebook URL:', facebookURL);
    // console.log('Linkedin URL:', linkedinURL);
    // console.log('Twitter URL:', twitterURL);
    // console.log('Instagram URL:', instagramURL);
    // console.log('Address:', address);
    // console.log('Phone Number:', phoneNumber);
    // console.log('Email:', email);
    let data={
        name,
        description,
        companyLogo,
        facebookURL,
        linkedinURL,
        twitterURL,
        instagramURL,
        address,
        phoneNumber,
        email


    }


    return res.status(200).json(data);
  
    //   res.status(200).send(data);
    } catch (error) {
      console.error('Error scraping:', error);
      res.status(500).send('Error scraping data');
    }
  });
// Route for user 
// app.use('/api/user',userRoutes)

// ROute for simple api with User Authentication 
app.listen(port,()=>{
    console.log(`Server is Listening on Port ${port}`)
})