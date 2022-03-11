FROM node
EXPOSE 3000
COPY . /usr/local/bananaztech
WORKDIR /usr/local/bananaztech
RUN npm i
CMD ["npm", "run", "start"]