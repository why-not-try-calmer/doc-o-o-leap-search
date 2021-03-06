## Testing the search feature
1. Serve `index.html`:

```
python3 -m http.server
```
This will read and load the index from `leap_index.json`, and use it for searching the Leap documentation.

2. Visit the endpoint (by default: `http://0.0.0.0:8000`) and start typing terms pertaining to the Leap documentation inside the text field.

## Testing the update script
1. Install the dependencies from `requirements.txt` with you favorite python dependencies manager. For `pipenv`:
```python
pipenv install
```
from this directory. 

2. Run the virtual environment. For `pipenv`:
```python
pipenv shell
```

3. Run `regenerate_index.py` from inside the virtual environment: 
```python
python regenerate_index.py
```

This will overwrite `leap_index.json` with a fresher index build.

## Running or deploying the update script via Podman/Docker
You can test the Python script from inside a containerized environment before deploying it to a remote machine. A shell script is provided for this purpose (you'll need to substitute _podman_ for _docker_ in the shell script (`run.sh`) if you don't use podman. Then:
1. Make the run script executable: `chmod u+x run.sh`
2. Run it: `./run.sh`

In some rare cases in my testing the script wasnt' able to complete. If that happens simply run the commands in the script one after the other.

## Limitations & shortcomings
- the HTML from the target url must be well-formed; if the parser fails, the entire script fails
  - solution: generate the index from the static web site generator used by doc-o-o
- the update script must be run everytime the Leap documentation rebuilds
  - solution: run the rebuild and the update script from the same operation
- the search feature does not take advantage of lunr's advanced search capabilities (https://lunrjs.com/guides/searching.html)
  - solution: `lib.js:search` can be easily customized to improve the situation
- the update script writes and read from disk, which is not slow and not necessary
  - solution:  the update script can easily be rewritten to write the fresh index to any database able to handle .json
