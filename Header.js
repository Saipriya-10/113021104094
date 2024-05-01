#!/usr/bin/python3
import requests
from statistics import mean
from typing import Union
from fastapi import FastAPI
app = FastAPI()
API_URL_TEST = 'http://20.244.56.144/test/'
TIMEOUT = 0.5 #500ms
PREV_STATE_PRIME = []
PREV_STATE_FIB = []
PREV_STATE_EVEN = []
PREV_STATE_RAND = []
class InvalidRequestException(Exception):
    pass
def get_response_from_test_server(req_url, prev_state):
 #import pdb;pdb.set_trace()
 try:
    res = requests.get(req_url, timeout = TIMEOUT)
    json_res = res.json()
    numbers = json_res["numbers"]
 except Exception as e:
    #MOCKING Response from test server
    if '/p' in req_url:
        numbers = [2,3,5,7,11]
    elif '/f' in req_url:
        numbers = [0,1,1,2,3,5,8]
    elif '/e' in req_url:
        numbers = [2,4,6,8]
    elif '/r' in req_url:
        numbers = [2,5,6,8,9]
if len(numbers) > 10:
    pass
    # logic to send current state if window size is more 
than 10
    #present_state = modified_new_state
else:
    present_state = numbers
    average = mean(numbers)
    print(prev_state)
    prev_state = list(set(prev_state))
    numbers = numbers
    
 return present_state, prev_state, numbers, average
def get_primes():
    req_url = API_URL_TEST + 'primes'
    try:
        present_state, prev_state, numbers, avg = 
get_response_from_test_server(req_url, PREV_STATE_PRIME)
 except Exception as e:
        return 'Exception occurred!'
    json_res = {"windowPrevState" : prev_state,"windowCurrState" : present_state,"numbers" : numbers,"avg": avg}

    PREV_STATE_PRIME.append(present_state)
    return json_res
def get_fib():
    req_url = API_URL_TEST + 'fibo'
    try:
        present_state, prev_state, numbers, avg = 
get_response_from_test_server(req_url, PREV_STATE_PRIME)
 except Exception as e:
    return 'Exception occurred'
 json_res = {"windowPrevState" : prev_state,"windowCurrState" : present_state,"numbers" : numbers,"avg": avg}
 
 PREV_STATE_FIB.append(present_state)
 return json_res
 def get_even():
    req_url = API_URL_TEST + 'even'
    try:
        present_state, prev_state, numbers, avg = 
 get_response_from_test_server(req_url, PREV_STATE_PRIME)
  except Exception as e:
        return 'Exception occurred'
  json_res = {"windowPrevState" : prev_state,"windowCurrState" : present_state,"numbers" : numbers, "avg": avg}

  PREV_STATE_EVEN.append(present_state)
  return json_res
 def get_rand():
    req_url = API_URL_TEST + 'rand'
    try:
        present_state, prev_state, numbers, avg = 
get_response_from_test_server(req_url, PREV_STATE_PRIME)
 except Exception as e:
        return 'Exception occurred'
 json_res = {"windowPrevState" : prev_state,"windowCurrState" : present_state,"numbers" : numbers,"avg": avg}
 
 PREV_STATE_RAND.append(present_state)
 return json_res
 @app.get("/")
def home():
    return "go to /numbers/{number_id} where number id should 
be either of 'p', 'f', 'e', 'r'"
@app.get("/numbers/{number_id}")
def get_response(number_id: str):
    if number_id == 'p':
        response = get_primes()
    elif number_id == 'f':
        response = get_fib()
    elif number_id == 'e':
        response = get_even()
    elif number_id == 'r':
        response = get_rand()
    else:
        return InvalidRequestException('Number Id is invalid')
 return response
if __name__ == '_main_':
 uvicorn.run(app, host="0.0.0.0", port=9876)