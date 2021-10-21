FROM python:3.10


WORKDIR /code

COPY requirements_prod.txt .
RUN pip install -r requirements_prod.txt


COPY easybudget ./easybudget
COPY app.py .


CMD ["flask", "run", "--host", "0.0.0.0"]
