import tensorflow as tf
print("TensorFlow built with CUDA:", tf.test.is_built_with_cuda())
print("Num GPUs Available:", len(tf.config.list_physical_devices('GPU')))
print(tf.config.list_physical_devices('GPU'))
