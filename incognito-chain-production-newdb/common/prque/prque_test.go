// CookieJar - A contestant's algorithm toolbox
// Copyright (c) 2013 Peter Szilagyi. All rights reserved.
//
// CookieJar is dual licensed: use of this source code is governed by a BSD
// license that can be found in the LICENSE file. Alternatively, the CookieJar
// toolbox may be used in accordance with the terms and conditions contained
// in a signed written agreement between you and the author(s).

package prque

import (
	"math/rand"
	"testing"
)

func TestPrque(t *testing.T) {
	// Generate a batch of random data and a specific priority order
	size := 16 * blockSize
	prio := rand.Perm(size)
	data := make([]int, size)
	for i := 0; i < size; i++ {
		data[i] = rand.Int()
	}
	queue := New(nil)
	for rep := 0; rep < 2; rep++ {
		// Fill a priority queue with the above data
		for i := 0; i < size; i++ {
			queue.Push(data[i], int64(prio[i]))
			if queue.Size() != i+1 {
				t.Errorf("queue size mismatch: have %v, want %v.", queue.Size(), i+1)
			}
		}
		// Create a map the values to the priorities for easier verification
		dict := make(map[int64]int)
		for i := 0; i < size; i++ {
			dict[int64(prio[i])] = data[i]
		}
		// Pop out the elements in priority order and verify them
		prevPrio := int64(size + 1)
		for !queue.Empty() {
			val, prio := queue.Pop()
			if prio > prevPrio {
				t.Errorf("invalid priority order: %v after %v.", prio, prevPrio)
			}
			prevPrio = prio
			if val != dict[prio] {
				t.Errorf("push/pop mismatch: have %v, want %v.", val, dict[prio])
			}
			delete(dict, prio)
		}
	}
}

func TestReset(t *testing.T) {
	// Generate a batch of random data and a specific priority order
	size := 16 * blockSize
	prio := rand.Perm(size)
	data := make([]int, size)
	for i := 0; i < size; i++ {
		data[i] = rand.Int()
	}
	queue := New(nil)
	for rep := 0; rep < 2; rep++ {
		// Fill a priority queue with the above data
		for i := 0; i < size; i++ {
			queue.Push(data[i], int64(prio[i]))
			if queue.Size() != i+1 {
				t.Errorf("queue size mismatch: have %v, want %v.", queue.Size(), i+1)
			}
		}
		// Create a map the values to the priorities for easier verification
		dict := make(map[int64]int)
		for i := 0; i < size; i++ {
			dict[int64(prio[i])] = data[i]
		}
		// Pop out half the elements in priority order and verify them
		prevPrio := int64(size + 1)
		for i := 0; i < size/2; i++ {
			val, prio := queue.Pop()
			if prio > prevPrio {
				t.Errorf("invalid priority order: %v after %v.", prio, prevPrio)
			}
			prevPrio = prio
			if val != dict[prio] {
				t.Errorf("push/pop mismatch: have %v, want %v.", val, dict[prio])
			}
			delete(dict, prio)
		}
		// Reset and ensure it's empty
		queue.Reset()
		if !queue.Empty() {
			t.Errorf("priority queue not empty after reset: %v", queue)
		}
	}
}

func BenchmarkPush(b *testing.B) {
	// Create some initial data
	data := make([]int, b.N)
	prio := make([]int64, b.N)
	for i := 0; i < len(data); i++ {
		data[i] = rand.Int()
		prio[i] = rand.Int63()
	}
	// Execute the benchmark
	b.ResetTimer()
	queue := New(nil)
	for i := 0; i < len(data); i++ {
		queue.Push(data[i], prio[i])
	}
}

func BenchmarkPop(b *testing.B) {
	// Create some initial data
	data := make([]int, b.N)
	prio := make([]int64, b.N)
	for i := 0; i < len(data); i++ {
		data[i] = rand.Int()
		prio[i] = rand.Int63()
	}
	queue := New(nil)
	for i := 0; i < len(data); i++ {
		queue.Push(data[i], prio[i])
	}
	// Execute the benchmark
	b.ResetTimer()
	for !queue.Empty() {
		queue.Pop()
	}
}

func TestPrque_Push(t *testing.T) {
	queue := New(nil)

	queue.Push("test1", 3)
	queue.Push("test2", 3)
	queue.Push("test3", 4)
	queue.Push("test4", 5)

	t.Log(queue.Pop())
	t.Log(queue.Pop())
	t.Log(queue.Pop())
	t.Log(queue.Pop())

	queue.Push("test1", -4)
	queue.Push("test2", -3)
	queue.Push("test3", -3)
	queue.Push("test4", -5)

	t.Log(queue.Pop())
	t.Log(queue.Pop())
	t.Log(queue.Pop())
	t.Log(queue.Pop())
}
