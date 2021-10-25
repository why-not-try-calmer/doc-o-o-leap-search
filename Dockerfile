FROM opensuse/leap
RUN zypper install -y python3-pip
WORKDIR /app
COPY requirements.txt ./
COPY regenerate_index.py ./
RUN pip3 install -r requirements.txt --no-cache-dir
CMD ["python3", "regenerate_index.py"]