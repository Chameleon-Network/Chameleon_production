// Copyright (c) 2013-2015 The thaibaoautonomous developers
// Use of this source code is governed by an ISC
// license that can be found in the LICENSE file.

package base58

//go:generate go run genalphabet.go

type Base58 struct {
}

// Decode decodes a modified base58 string to a byte slice.
func (base58 Base58) Decode(b string) []byte {
	d, err := Decode(b)
	if err != nil {
		d = nil
	}
	return d
}

// Encode encodes a byte slice to a modified base58 string.
func (base58 Base58) Encode(b []byte) string {
	return Encode(b)
}
