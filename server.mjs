import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import analyze from './api/analyze.js';
import health from './api/health.js';
const root=path.dirname(fileURLToPath(import.meta.url));
const contentTypes={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.json':'application/json'};
const port=Number(process.env.PORT||3000);
http.createServer(async(req,res)=>{
 res.status=(status)=>{res.statusCode=status;return res};res.json=(data)=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(data));return res};
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/api/analyze'||url.pathname==='/api/health'){
  if(url.pathname==='/api/analyze'){
   let input='';for await(const chunk of req){input+=chunk;if(input.length>8*1024*1024){res.status(413).json({error:'Upload too large'});return}}
   try{req.body=JSON.parse(input)}catch{req.body={}}
   return analyze(req,res);
  }
  return health(req,res);
 }
 if(req.method!=='GET'&&req.method!=='HEAD'){res.statusCode=405;return res.end('Method not allowed')}
 const requested=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);
 const location=path.resolve(root,'.'+requested);
 if(!location.startsWith(root+path.sep)){res.statusCode=403;return res.end('Forbidden')}
 if(/(^|\/)(\.env|node_modules|tests|scripts)(\/|$)/.test(location)||location.endsWith('package-lock.json')){res.statusCode=404;return res.end('Not found')}
 try{const body=await readFile(location);res.setHeader('Content-Type',contentTypes[path.extname(location)]||'application/octet-stream');res.end(req.method==='HEAD'?'':body)}catch{res.statusCode=404;res.end('Not found')}
}).listen(port,()=>console.log(`WasteWise AI local server: http://localhost:${port}`));
