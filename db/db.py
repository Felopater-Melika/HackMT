#!/bin/env python3

import mysql.connector

mydb = mysql.connector.connect(host="localhost",user='user',password='thisisnotsecure',database='hospital-prices-allpayers')
mc = mydb.cursor()

from flask import Flask
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)

class HelloWorld(Resource):
    def get(self,bcode):
        sql = """
SELECT count(negotiated_rate),min(negotiated_rate),avg(negotiated_rate),max(negotiated_rate)
FROM   tin_rate_file
       JOIN rate
         ON rate.id = tin_rate_file.rate_id
       JOIN code
         ON code.id = rate.code_id
WHERE  billing_code = %s limit 10;
"""
        sql_bcode = (bcode,)
        mc.execute(sql,sql_bcode)
        mr = mc.fetchall()
        print(mr)

        return {'avg':float(mr[0][3])}

api.add_resource(HelloWorld, '/price/<string:bcode>')

if __name__ == '__main__':
    app.run(debug=True)
