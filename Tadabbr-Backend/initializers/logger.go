package initializers

import (
	"os"

	"github.com/sirupsen/logrus"
)

func Initlogrus() {
	// Open or create the log file
	file, err := os.OpenFile("logrus.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		logrus.Fatalf("Failed to open log file: %v", err)
	}

	// Log to file
	logrus.SetOutput(file)
	logrus.SetFormatter(&logrus.TextFormatter{
		FullTimestamp: true,
	})
	logrus.SetLevel(logrus.ErrorLevel)

}
