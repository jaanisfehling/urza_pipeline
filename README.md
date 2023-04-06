# Pipeline

This Pipeline will receive new articles from the Webcrawlers and parse them with the
Mozilla Readability library. A future goal is to also classify the article with ML.
This could be done via Tensorflow.js.

This pipeline uses worker_threads for the CPU-intensive parsing but pushes to the
database in the main thread, because Node can do I/O asynchronous faster by nature.
worker_threads is still slow, since it spawns subprocesses instead of creating threads
(impossible in Node). It is good enough for real-time scraping, but probably not for scraping
large batches at a time.

Finally it will send them to the Django Channels Websocket application so the article
can be distributed to all subscribers.