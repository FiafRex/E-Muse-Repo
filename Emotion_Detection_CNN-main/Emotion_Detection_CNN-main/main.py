from http.server import BaseHTTPRequestHandler, HTTPServer
from keras.models import load_model
from keras.preprocessing.image import img_to_array
import cv2
import numpy as np

# Set the absolute paths to the cascade classifier and the pre-trained model
face_cascade_path = r'C:\MyFiles\Capstone\Coding\CNN\Emotion_Detection_CNN-main\Emotion_Detection_CNN-main\haarcascade_frontalface_default.xml'
model_path = r'C:\MyFiles\Capstone\Coding\CNN\Emotion_Detection_CNN-main\Emotion_Detection_CNN-main\model.h5'

# Load the cascade classifier and the pre-trained model
face_classifier = cv2.CascadeClassifier(face_cascade_path)
classifier = load_model(model_path)

# Define the emotion labels
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']

# Variable to store the latest detected emotion
latest_emotion = ""

class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/emotion_detection':
            # Start emotion detection
            cap = cv2.VideoCapture(0)
            while True:
                _, frame = cap.read()
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                faces = face_classifier.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

                for (x, y, w, h) in faces:
                    roi_gray = gray[y:y+h, x:x+w]
                    roi_gray = cv2.resize(roi_gray, (48, 48), interpolation=cv2.INTER_AREA)

                    if np.sum([roi_gray]) != 0:
                        roi = roi_gray.astype('float') / 255.0
                        roi = img_to_array(roi)
                        roi = np.expand_dims(roi, axis=0)

                        prediction = classifier.predict(roi)[0]
                        detected_emotion = emotion_labels[prediction.argmax()]  # Get the detected emotion
                        label_position = (x, y)
                        cv2.putText(frame, detected_emotion, label_position, cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

                cv2.imshow('Emotion Detector', frame)
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break

            cap.release()
            cv2.destroyAllWindows()

            # Send the detected emotion as the response
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(bytes(detected_emotion, 'utf-8'))  # Send the detected emotion
        else:
            # Serve website files
            try:
                if self.path == '/':
                    self.path = '/index.html'
                file_to_open = open(self.path[1:]).read()
                self.send_response(200)
            except:
                file_to_open = "File not found"
                self.send_response(404)
            self.end_headers()
            self.wfile.write(bytes(file_to_open, 'utf-8'))


def run(server_class=HTTPServer, handler_class=RequestHandler, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Server running on port {port}")
    httpd.serve_forever()

if __name__ == "__main__":
    run()
