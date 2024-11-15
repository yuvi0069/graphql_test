import { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import { schema } from "../GraphQlApi/index"; 
import { graphqlUploadExpress } from "graphql-upload";

export const routes = async (app: Application): Promise<void> => {
  app.use(graphqlUploadExpress());
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
    introspection: true  
  });

  await apolloServer.start();


  apolloServer.applyMiddleware({ app, path: "/api/graphQl",cors: true }); 
//   app.get('/api/graphql', (req, res) => {
//     res.send(`
//       <html>
//         <head>
//           <title>GraphiQL</title>
//           <link rel="stylesheet" href="https://unpkg.com/graphiql/graphiql.css" />
//           <script src="https://unpkg.com/react/umd/react.production.min.js"></script>
//           <script src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"></script>
//           <script src="https://unpkg.com/graphiql/graphiql.min.js"></script>
//           <style>
//             html, body, #graphiql { height: 100%; margin: 0; }
//           </style>
//         </head>
//         <body>
//           <div id="graphiql">Loading...</div>
//           <script>
//             const graphQLFetcher = (graphQLParams) => fetch('/api/graphql', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify(graphQLParams),
//             }).then(response => response.json()).catch(() => response.text());

//             ReactDOM.render(
//               React.createElement(GraphiQL, { fetcher: graphQLFetcher }),
//               document.getElementById('graphiql'),
//             );
//           </script>
//         </body>
//       </html>
//     `);
//   });
//   app.use('/voyager', voyagerMiddleware({ endpointUrl: '/api/graphql' }));

  
};
