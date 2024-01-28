#!/bin/env python3

import mysql.connector

mydb = mysql.connector.connect(host="localhost",database='hospital-prices-allpayers', user='root')
mc = mydb.cursor()

from flask import Flask, request, jsonify
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)

class HelloWorld(Resource):
    def post(self):
        sql = """
SELECT count(negotiated_rate),min(negotiated_rate),avg(negotiated_rate),max(negotiated_rate)
FROM   tin_rate_file
       JOIN rate
         ON rate.id = tin_rate_file.rate_id
       JOIN code
         ON code.id = rate.code_id
WHERE  billing_code = %s limit 10;
"""
        data = request.get_json()
        
        if not data or not 'bcodes' in data:
            return {'message': 'The new user must have a name'}, 400
        
        bcodes = data['bcodes'] 
        avg_prices = {}

        for bcode in bcodes:
            sql_bcode = (bcode,)
            mc.execute(sql,sql_bcode)
            mr = mc.fetchall()
            print(mr) 

            if mr[0][2] is not None:
                avg_prices[bcode] = float(mr[0][2])


        return {'avg_prices' : avg_prices}

api.add_resource(HelloWorld, '/price')

if __name__ == '__main__':
    app.run(debug=True)
