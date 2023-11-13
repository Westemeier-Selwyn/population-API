# Luxembourg population API

This application lets you get the population of Luxembourg given a specific date, if this date is not available in the database, the API will give you the closest dates with the population, the one before, and the one after the specified date.


## First Part

To retrieve the date, I opted for the first option of manually downloading the csv file and parsing it, using csv-parser.

Make a GET request to the /population endpoint with the desired date parameter:

```bash
curl -X GET "http://localhost:3000/population?date=(desired-date)"
```
Replace (desired-date) with the date of which you want the population of, in format year-month-day, for example 1849-12-03.

This will return the total population for the specified date or the closest available entries before and after if the exact date is not found.


### Example Responses

Exact Match:

```json
{"date":"1849-12-03","totalPopulation":189783}
```
Closest Entries:

```json
{"date":"1849-12-01","closestBefore":{"date":"1847-12-31","totalPopulation":186062},"closestAfter":{"date":"1849-12-03","totalPopulation":189783},"message":"Population data not found for the given date. Showing closest available entries."}
```


## Second Part

To build and run the application using Docker, follow these steps:

1. **Clone the Repository:**

   ```bash
   git clone 
   cd (repository-directory)
   ```
2. **Build the Docker Image:**

    ```bash
    docker build -t (image-name) .
    
    ```
    Replace (image-name) with a name you choose for your Docker image.

3. **Run the Docker Container:**

    ```bash
    docker run -p 3000:3000 -d (image-name)
    ```
    This command starts the Docker container in detached mode, mapping port 3000 from the container to your host machine.

## Third Part

Unfortunately I was unable to get the third part running.