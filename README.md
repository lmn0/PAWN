What is PAWN? 

A deployment service, where the users don’t need to maintain their own infrastructure and can push all their codes to a private docker and then download it. 

Its as simple as these diagrams depict:

![Alt text](public/images/build_1.jpg?raw=true "Build you App")  ![Alt text](public/images/create_1.jpg?raw=true "Draw out your deployment")




System Architecture
—————————————————————————————————————————————

![Alt text](public/images/projarch.jpg?raw=true "PAWN Architecture")

A multi-tenant architecture where the user or a startup can subscribe for the application and then be able to use it for a monthly charge. 

Stormpath API, a simple REST API, over HTTP was used to implement the multi-tenant architecture. It is a flexible cloud service which can manage millions of users and also provide authentication for the administartors. 

MVC architecture was used for modularity.The entire platform was built on Node JS as the base image as it helps to expose the REST API’s. Elastic scaling would be possible as the servers would be AWS EC2 instances. The configured images are then stored in the docker hub.

Rabbit MQ becomes an important part in the implementation of the middle tier subsystem as the messages from the Node JS server were carried to the config servers where carried out by it. 

Running the code
—————————————————————————————————————————————

All you need to do is edit the bin/www file to set the port and start the code with the following:

		npm start

To install the node modules use,

		npm install .


