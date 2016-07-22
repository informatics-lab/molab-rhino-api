#!/bin/sh
export FLASK_APP=./python-server/ledserver.py
python -m flask run --host=0.0.0.0 --port 8000

